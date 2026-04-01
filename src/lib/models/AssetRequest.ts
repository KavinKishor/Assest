import mongoose, { Schema, type Document } from "mongoose";

export interface IAssetRequest extends Document {
    reqId: string;
    type: "CREATE" | "UPDATE" | "DELETE";
    category: "IT_Assets" | "Office_Assets" | "Softwares";
    section: string;
    assetData: Record<string, unknown>;
    creator: {
        userId: mongoose.Types.ObjectId;
        name: string;
        email: string;
        role: string;
    };
    status: "Pending" | "Approved" | "Rejected";
    managerComment?: string;
    approver?: {
        userId: mongoose.Types.ObjectId;
        name: string;
        role: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const AssetRequestSchema: Schema = new Schema(
    {
        reqId: { type: String, required: true, unique: true },
        type: { type: String, enum: ["CREATE", "UPDATE", "DELETE"], required: true },
        category: { type: String, enum: ["IT_Assets", "Office_Assets", "Softwares"], required: true },
        section: { type: String, required: true },
        assetData: { type: Schema.Types.Mixed, required: true },
        creator: {
            userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            name: { type: String, required: true },
            email: { type: String },
            role: { type: String, required: true }
        },
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
        managerComment: { type: String },
        approver: {
            userId: { type: Schema.Types.ObjectId, ref: "User" },
            name: { type: String },
            role: { type: String }
        }
    },
    { timestamps: true }
);

// Clear the model if it exists to ensure schema updates are picked up in development
if (mongoose.models.AssetRequest) {
    delete mongoose.models.AssetRequest;
}

export default mongoose.model<IAssetRequest>("AssetRequest", AssetRequestSchema);
