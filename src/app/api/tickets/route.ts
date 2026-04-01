import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";
import TicketTracking from "@/lib/models/TicketTracking";
import { getSession } from "@/lib/auth";
import Notification from "@/lib/models/Notification";
import User from "@/lib/models/User";
import { sendTicketEmail } from "@/lib/email";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        let query = {};
        const isITOrManagement = ["IT_Admin", "IT_Associate", "Manager", "VP", "CEO"].includes(session.role);

        if (isITOrManagement) {
            query = {};
        } else {
            // Employees (or anyone else) only see tickets they created
            query = { createdBy: session.id };
        }



        const tickets = await Ticket.find(query)
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });
        return NextResponse.json(tickets);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        await connectToDatabase();

        // Generate ticket ID
        const count = await Ticket.countDocuments();
        const ticketId = `TKT-${String(count + 1).padStart(4, "0")}`;

        const newTicket = await Ticket.create({
            ...data,
            ticketId,
            createdBy: session.id,
        });

        // Initial tracking log
        await TicketTracking.create({
            ticket: newTicket._id,
            action: "Created",
            description: `Ticket created by ${session.name || 'user'}`,
            performedBy: session.id,
        });

        // Notify Managers, VPs and IT Admins
        const staffUsers = await User.find({
            role: { $in: ["Manager", "VP", "IT_Admin"] },
        });

        const notifications = staffUsers
            .filter(user => String(user._id) !== String(session.id))
            .map((user) => ({
                recipient: user._id,
                sender: session.id,
                type: "Ticket_Created",
                title: "New Ticket Created",
                message: `${session.name} (${session.role}) created a new ticket: ${newTicket.ticketId}. Needs approval/assignment.`,
                link: `/ticket?id=${newTicket._id}`,
            }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);

            // Emit to real-time bus
            const { notificationEmitter } = await import("@/lib/events");
            notifications.forEach(n => notificationEmitter.emit("notification", n));

            // Send emails ONLY to Managers and VPs
            for (const user of staffUsers) {
                if (user.email && (user.role === "Manager" || user.role === "VP")) {
                    await sendTicketEmail(
                        user.email,
                        "New Ticket Alert",
                        newTicket,
                        `A new ticket has been created by ${session.name} and requires your action.`
                    );
                }
            }
        }

        return NextResponse.json(newTicket, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
