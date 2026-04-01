import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";
import TicketTracking from "@/lib/models/TicketTracking";
import Notification from "@/lib/models/Notification";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
import { sendTicketEmail } from "@/lib/email";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const ticket = await Ticket.findById(id)
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role");

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        const tracking = await TicketTracking.find({ ticket: id })
            .populate("performedBy", "name role")
            .sort({ createdAt: -1 });

        return NextResponse.json({ ticket, tracking });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { comment, ...data } = await request.json();

        if (!comment || typeof comment !== 'string' || !comment.trim()) {
            return NextResponse.json({ error: "Comment is required for all ticket updates" }, { status: 400 });
        }

        await connectToDatabase();

        const oldTicket = await Ticket.findById(id);
        if (!oldTicket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // Role-based validation
        const isManagement = ["Manager", "VP", "CEO"].includes(session.role);

        // Global check: Prevent ANY updates before manager approval for non-management roles
        if (!isManagement && oldTicket.approvalStatus !== "Approved") {
            return NextResponse.json({
                error: "Updates are disabled until the ticket is Approved by a Manager"
            }, { status: 403 });
        }

        // Only Managers/VPs can change approval status
        if (data.approvalStatus && data.approvalStatus !== oldTicket.approvalStatus && !isManagement) {
            return NextResponse.json({ error: "Only Managers, VPs or CEO can approve tickets" }, { status: 403 });
        }

        // Only Managers/VPs can change assignments
        if (data.assignedTo && String(data.assignedTo) !== String(oldTicket.assignedTo) && !isManagement) {
            return NextResponse.json({ error: "Only Managers, VPs or CEO can assign tickets" }, { status: 403 });
        }

        // IT Associates can only update tickets assigned to them
        if (session.role === "IT_Associate" && String(oldTicket.assignedTo) !== session.id) {
            return NextResponse.json({ error: "You can only update tickets assigned to you" }, { status: 403 });
        }

        if (data.assignedTo && String(data.assignedTo) === String(oldTicket.createdBy)) {
            return NextResponse.json({ error: "Cannot assign ticket to its creator" }, { status: 400 });
        }

        // If approval status OR assignment is being updated by a Management member, record them
        if ((data.approvalStatus || data.assignedTo) && isManagement) {
            data.approvalManager = session.id;
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            { ...data },
            { new: true }
        ).populate("assignedTo", "name email role")
            .populate("createdBy", "name email role")
            .populate("approvalManager", "name email role");

        // Tracking Logic
        let action: string = "Status Change";
        let description = `Status updated to ${updatedTicket.currentStatus}`;

        if (data.approvalStatus && data.approvalStatus !== oldTicket.approvalStatus) {
            action = "Approval Change";
            description = `Approval status changed to ${data.approvalStatus}`;
        }

        if (data.assignedTo && data.assignedTo !== String(oldTicket.assignedTo)) {
            action = "Assignment";
            description = `Ticket assigned to ${updatedTicket.assignedTo?.name || 'an IT Associate'}`;
        }

        await TicketTracking.create({
            ticket: updatedTicket._id,
            action,
            description,
            comment,
            previousStatus: oldTicket.currentStatus,
            newStatus: updatedTicket.currentStatus,
            performedBy: session.id,
        });

        // Notification Logic
        const recipients = new Set<string>();
        recipients.add(String(updatedTicket.createdBy._id));

        if (updatedTicket.assignedTo) {
            recipients.add(String(updatedTicket.assignedTo._id));
        }

        // status updated by anyone! should notify Management and IT_Admin
        // and also the people involved (Creator, Assignee)
        const staffUsers = await User.find({
            role: { $in: ["Manager", "VP", "IT_Admin", "CEO"] },
        });

        staffUsers.forEach(user => recipients.add(String(user._id)));

        const notifications = Array.from(recipients)
            .filter(r => r !== String(session.id)) // Don't notify the person who made the change
            .map(recipientId => {
                let type: string = "Status_Update";
                let title = `Ticket ${updatedTicket.ticketId} Updated`;

                if (action === "Approval Change") {
                    type = "Ticket_Approved";
                    title = `Ticket ${updatedTicket.ticketId} Approval Update`;
                } else if (action === "Assignment") {
                    type = "Ticket_Assigned";
                    title = `Ticket ${updatedTicket.ticketId} Assigned`;
                }

                return {
                    recipient: recipientId,
                    sender: session.id,
                    type,
                    title,
                    message: description,
                    link: `/ticket?id=${updatedTicket._id}`,
                };
            });

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);

            // Emit to real-time bus
            const { notificationEmitter } = await import("@/lib/events");
            notifications.forEach(n => notificationEmitter.emit("notification", n));
        }

        // Email logic for final status
        if (updatedTicket.currentStatus === "Closed" || updatedTicket.currentStatus === "Unsolved") {
            // Send email to the manager who assigned/approved it
            if (updatedTicket.approvalManager?.email) {
                await sendTicketEmail(
                    updatedTicket.approvalManager.email,
                    "Final Ticket Status Update",
                    updatedTicket,
                    `The ticket has reached a final state: ${updatedTicket.currentStatus}`
                );
            }
        }

        return NextResponse.json(updatedTicket);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
