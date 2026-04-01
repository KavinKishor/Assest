import mongoose, { Schema, type Document } from "mongoose";

export interface IDynamicOfficeAsset extends Document {
    sectionSlug: string;
    assetId: string;
    vendor: string;
    location: string;
    quantity: number;
    dateOfPurchase: string;
    status: string;
    remarks: string;
}

const DynamicOfficeAssetSchema = new Schema({
    sectionSlug: { type: String, required: true },
    assetId: { type: String, required: true },
    vendor: String,
    location: String,
    quantity: { type: Number, default: 1 },
    dateOfPurchase: String,
    status: { type: String, default: "Active" },
    remarks: String,
}, { timestamps: true });

export default mongoose.models.DynamicOfficeAsset || mongoose.model<IDynamicOfficeAsset>("DynamicOfficeAsset", DynamicOfficeAssetSchema);
