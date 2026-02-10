import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key-keep-it-safe";

import { type JwtPayload as JwtP } from "jsonwebtoken";

export interface JWTPayload extends JwtP {
    id: string;
    userId: string;
    email: string;
    role: string;
    name: string;
    iat?: number;
    exp?: number;
}

export async function createToken(payload: JWTPayload | Record<string, unknown>) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as JWTPayload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    const allowInsecure = process.env.ALLOW_INSECURE_COOKIES === "true";

    cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: isProduction && !allowInsecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
}
