import mongoose, { Schema, type Document } from "mongoose";

export interface ISection extends Document {
    slug: string;
    name: string;
    iconName: string;
    categoryId: string;
    categoryType: "Office" | "IT";
    fields?: { label: string; key: string }[];
}

const SectionSchema = new Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    iconName: { type: String, required: true, default: "Box" },
    categoryId: { type: String, required: true },
    categoryType: { type: String, enum: ["Office", "IT"], default: "Office" },
    fields: [{
        label: { type: String, required: true },
        key: { type: String, required: true }
    }]
}, { timestamps: true });

export default mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);
