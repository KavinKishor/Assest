import mongoose, { Schema, type Document } from "mongoose";

export interface ITicket extends Document {
    ticketId: string;
    assetId: string;
    assetName: string;
    issue: "Software" | "Hardware";
    tool?: string; // Additional selection if software selected
    description: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    currentStatus: "Open" | "In Progress" | "Resolved" | "Closed" | "Unsolved";
    reportingManager?: string;
    approvalStatus: "Pending" | "Approved" | "Rejected" | "Not Required";
    approvalManager?: mongoose.Types.ObjectId;
    officeLocation: "Acidus HO" | "Acidus Tidel" | "Acidus JP";
    cabinId: string;
    floor: string;
    assignedTo?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
    {
        ticketId: { type: String, required: true, unique: true },
        assetId: { type: String, required: true },
        assetName: { type: String, required: true },
        issue: {
            type: String,
            enum: ["Software", "Hardware"],
            required: true,
        },
        tool: { type: String },
        description: { type: String, required: true },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Urgent"],
            default: "Medium",
        },
        currentStatus: {
            type: String,
            enum: ["Open", "In Progress", "Resolved", "Closed", "Unsolved"],
            default: "Open",
        },
        reportingManager: { type: String },
        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Not Required"],
            default: "Pending",
        },
        approvalManager: { type: Schema.Types.ObjectId, ref: "User" },
        officeLocation: {
            type: String,
            enum: ["Acidus HO", "Acidus Tidel", "Acidus JP"],
            required: true,
        },
        cabinId: { type: String, required: true },
        floor: { type: String, required: true },
        assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
