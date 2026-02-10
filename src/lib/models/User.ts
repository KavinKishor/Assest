import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    userId: string;
    email: string;
    password?: string;
    role: "IT_Associate" | "IT_Admin" | "Manager" | "VP" | "CEO" | "employee";
    department: string;
    isVerified: boolean;
    otp?: string;
    otpExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        userId: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["IT_Associate", "IT_Admin", "Manager", "VP", "CEO", "employee"],
            default: "IT_Associate",
        },
        department: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        otp: { type: String },
        otpExpires: { type: Date },
    },
    { timestamps: true }
);

// Clear the model if it exists to ensure schema updates like 'employee' role are picked up
if (mongoose.models.User) {
    delete mongoose.models.User;
}

export default mongoose.model<IUser>("User", UserSchema);
