import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { name, userId, email, password, department, role } = await request.json();

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ userId }, { email }]
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this AMS ID or Email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create unverified user
        await User.create({
            name,
            userId,
            email,
            password: hashedPassword,
            department,
            role: role || "IT_Associate", // Use provided role or default
            isVerified: false,
            otp,
            otpExpires,
        });

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otp);

        if (!emailSent) {
            // In a real app, you might want to handle this more gracefully
        }

        return NextResponse.json({
            success: true,
            message: "Registration successful. Please verify your email with the OTP sent.",
            email,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
