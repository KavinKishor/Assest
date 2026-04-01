import mongoose, { Schema } from "mongoose";

const baseOptions = { timestamps: true };

const SoftwareSchema = new Schema({
    softwareName: { type: String, required: true },
    version: String,
    developer: String,
    firstRelease: String,
    licenseKey: String,
    expiryDate: String,
    purchaseDate: String,
    quantity: { type: Number, default: 1 },
    vendor: String,
    location: String,
    remarks: String,
}, baseOptions);

const createSoftwareModel = (name: string) => mongoose.models[name] || mongoose.model(name, SoftwareSchema);

export const SoftwareModelMap: Record<string, mongoose.Model<unknown>> = {
    system: createSoftwareModel("Software_System"),
    application: createSoftwareModel("Software_Application"),
    development: createSoftwareModel("Software_Development"),
    database: createSoftwareModel("Software_Database"),
    cloud: createSoftwareModel("Software_Cloud"),
    security: createSoftwareModel("Software_Security"),
    others: createSoftwareModel("Software_Others"),
};

