import mongoose, { Schema, type Document } from "mongoose";

export interface ITicketTracking extends Document {
    ticket: mongoose.Types.ObjectId;
    action: "Created" | "Status Change" | "Approval Change" | "Assignment" | "Comment" | "Resolution";
    description: string;
    comment?: string;
    previousStatus?: string;
    newStatus?: string;
    performedBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const TicketTrackingSchema: Schema = new Schema(
    {
        ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
        action: {
            type: String,
            enum: ["Created", "Status Change", "Approval Change", "Assignment", "Comment", "Resolution"],
            required: true,
        },
        description: { type: String, required: true },
        comment: { type: String },
        previousStatus: { type: String },
        newStatus: { type: String },
        performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Index for faster queries on a ticket's history
TicketTrackingSchema.index({ ticket: 1, createdAt: -1 });

export default mongoose.models.TicketTracking ||
    mongoose.model<ITicketTracking>("TicketTracking", TicketTrackingSchema);
