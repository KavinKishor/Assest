import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const notifications = await Notification.find({ recipient: session.id })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(notifications);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, all } = await request.json();
        await connectToDatabase();

        if (all) {
            await Notification.updateMany(
                { recipient: session.id, isRead: false },
                { isRead: true }
            );
        } else if (id) {
            await Notification.findByIdAndUpdate(id, { isRead: true });
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
