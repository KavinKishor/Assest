import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";

export async function GET() {
    try {
        await connectToDatabase();

        // Aggregating tickets created and resolved per day for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const history = await Ticket.aggregate([
            {
                $facet: {
                    created: [
                        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    resolved: [
                        {
                            $lookup: {
                                from: "tickettrackings",
                                localField: "_id",
                                foreignField: "ticket",
                                as: "history",
                            },
                        },
                        { $unwind: "$history" },
                        {
                            $match: {
                                "history.action": "Resolution",
                                "history.createdAt": { $gte: thirtyDaysAgo },
                            },
                        },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$history.createdAt" } },
                                count: { $sum: 1 },
                            },
                        },
                    ],
                },
            },
        ]);

        // Format data for the chart (merging created and resolved by date)
        const dates: Record<string, { date: string; created: number; resolved: number }> = {};

        history[0].created.forEach((item: { _id: string; count: number }) => {
            dates[item._id] = { date: item._id, created: item.count, resolved: 0 };
        });

        history[0].resolved.forEach((item: { _id: string; count: number }) => {
            if (!dates[item._id]) {
                dates[item._id] = { date: item._id, created: 0, resolved: item.count };
            } else {
                dates[item._id].resolved = item.count;
            }
        });

        const result = Object.values(dates).sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json(result);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
