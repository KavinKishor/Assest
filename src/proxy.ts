import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key-keep-it-safe";

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const isPublicPath = path === "/login" || path.startsWith("/api/auth");

    // Paths that require IT_Admin role
    const isAdminOnlyPath = path === "/register" || path === "/firstAuth";

    const token = request.cookies.get("auth_token")?.value || "";

    // Handle Public Paths
    if (isPublicPath && token) {
        // If user is logged in and trying to access login, redirect to dashboard
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (!isPublicPath && !isAdminOnlyPath && !token) {
        // If user is not logged in and trying to access protected pages, redirect to login
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Role-based access control
    if (token) {
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jose.jwtVerify(token, secret);
            const role = payload.role as string;

            // Restrict /register and /firstAuth to IT_Admin
            if (isAdminOnlyPath && role !== "IT_Admin") {
                return NextResponse.redirect(new URL("/", request.nextUrl));
            }

            if (role === "employee") {
                const restrictedPaths = ["/assets", "/office-assets"];
                if (restrictedPaths.some(p => path.startsWith(p))) {
                    return NextResponse.redirect(new URL("/", request.nextUrl));
                }
            }
        } catch {
            return NextResponse.redirect(new URL("/login", request.nextUrl));
        }
    } else if (isAdminOnlyPath) {
        // If trying to access admin-only path without token
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/",
        "/assets/:path*",
        "/office-assets/:path*",
        "/ticket/:path*",
        "/dashboard/:path*",
        "/login",
        "/register",
        "/firstAuth",
    ],
};

