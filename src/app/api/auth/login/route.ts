import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { identifier, password } = await request.json();

        await connectToDatabase();

        // Check if it's the default admin user requested by the user
        if ((identifier === "AMS1352" || identifier === "admin@ams.com") && password === "admin123") {
            let user = await User.findOne({ userId: "AMS1352" });

            if (!user) {
                // Create the default user if it doesn't exist
                const hashedPassword = await bcrypt.hash("admin123", 10);
                user = await User.create({
                    name: "admin",
                    userId: "AMS1352",
                    email: "admin@ams.com",
                    password: hashedPassword,
                    role: "IT_Admin",
                    department: "IT",
                    isVerified: true,
                });
            }

            const token = await createToken({
                id: user._id,
                userId: user.userId,
                email: user.email,
                role: user.role,
                name: user.name,
            });

            await setAuthCookie(token);

            return NextResponse.json({
                success: true,
                user: {
                    name: user.name,
                    userId: user.userId,
                    email: user.email,
                    role: user.role,
                },
            });
        }

        // Regular login flow
        const user = await User.findOne({
            $or: [{ userId: identifier }, { email: identifier }],
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { error: "Please verify your account first", unverified: true, email: user.email },
                { status: 403 }
            );
        }

        const token = await createToken({
            id: user._id,
            userId: user.userId,
            email: user.email,
            role: user.role,
            name: user.name,
        });

        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                name: user.name,
                userId: user.userId,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
