import mongoose, { Schema, Document, Model } from "mongoose";
import { AssetCategory } from "@/types/asset";

export interface IAssetDetail extends Document {
    sNo: string;
    hostNameAssetId: string;
    cpu: string;
    processor: string;
    os: string;
    ipAddressHost: string;
    monitor1: string;
    monitor2: string;
    keyboard: string;
    mouse: string;
    voipBrand: string;
    ipAddressVoip: string;
    extension1: string;
    extension2: string;
    voipHeadphone: string;
    usbHeadphone: string;
    vendor: string;
    location: string;
    category: AssetCategory;
    createdAt: Date;
    updatedAt: Date;
}

const AssetDetailSchema: Schema = new Schema(
    {
        sNo: { type: String },
        hostNameAssetId: { type: String, required: true },
        cpu: { type: String },
        processor: { type: String },
        os: { type: String },
        ipAddressHost: { type: String },
        monitor1: { type: String },
        monitor2: { type: String },
        keyboard: { type: String },
        mouse: { type: String },
        voipBrand: { type: String },
        ipAddressVoip: { type: String },
        extension1: { type: String },
        extension2: { type: String },
        voipHeadphone: { type: String },
        usbHeadphone: { type: String },
        vendor: { type: String },
        location: { type: String },
        category: { type: String, required: true },
    },
    { timestamps: true }
);

/**
 * To fulfill the request "create new models based on sections", 
 * we can use this helper to get models for specific collections.
 */
export const getAssetModel = (category: string): Model<IAssetDetail> => {
    // Standardize collection names e.g., 'desktop_assets'
    const collectionName = `${category.toLowerCase()}_assets`;
    return mongoose.models[collectionName] || mongoose.model<IAssetDetail>(collectionName, AssetDetailSchema, collectionName);
};

// Generic model if needed
export const AssetDetailModel = mongoose.models.AssetDetail || mongoose.model<IAssetDetail>("AssetDetail", AssetDetailSchema);
