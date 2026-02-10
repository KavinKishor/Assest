import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        await connectToDatabase();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ error: "User is already verified" }, { status: 400 });
        }

        if (user.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        if (user.otpExpires && user.otpExpires < new Date()) {
            return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Email verified successfully. You can now login.",
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
