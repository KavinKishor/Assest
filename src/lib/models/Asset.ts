import mongoose, { Schema, Document } from "mongoose";
import { AssetVariant } from "@/types/asset";

export interface IAsset extends Document {
    title: string;
    count: number;
    variant: AssetVariant;
    iconName: string;
    category: string;
    categoryName: string; // The display name for the category
    createdAt: Date;
    updatedAt: Date;
}

const AssetSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        count: { type: Number, required: true, default: 0 },
        variant: {
            type: String,
            enum: ["blue", "green", "orange", "purple", "red"],
            default: "blue"
        },
        iconName: { type: String, required: true },
        category: { type: String, required: true }, // e.g., 'desktop-voip'
        categoryName: { type: String, required: true }, // e.g., 'Desktop and VOIP Assets'
    },
    { timestamps: true }
);

// Prevent re-compiling the model if it already exists
export const AssetModel = mongoose.models.Asset || mongoose.model<IAsset>("Asset", AssetSchema);
