import mongoose, { Schema, type Document } from "mongoose";

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId;
    type: "Ticket_Created" | "Ticket_Approved" | "Ticket_Assigned" | "Status_Update" | "Comment" | "Asset_Request" | "Asset_Approved" | "Asset_Rejected";
    title: string;
    message: string;
    link?: string; // e.g. /ticket?id=...
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        type: {
            type: String,
            enum: ["Ticket_Created", "Ticket_Approved", "Ticket_Assigned", "Status_Update", "Comment", "Asset_Request", "Asset_Approved", "Asset_Rejected"],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

// Clear the model if it exists to ensure schema updates are picked up in development
if (mongoose.models.Notification) {
    delete mongoose.models.Notification;
}

export default mongoose.model<INotification>("Notification", NotificationSchema);
