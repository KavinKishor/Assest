import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key-keep-it-safe";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const isPublicPath = path === "/login" || path === "/register" || path === "/firstAuth" || path.startsWith("/api/auth");

    const token = request.cookies.get("auth_token")?.value || "";

    if (isPublicPath && token) {
        // If user is logged in and trying to access auth pages, redirect to dashboard
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jose.jwtVerify(token, secret);
            const _role = payload.role as string;

            // Redirect base on role? Usually dashboard is safe.
            return NextResponse.redirect(new URL("/", request.nextUrl));
        } catch {
            // Token invalid, let them stay on public path
        }
    }

    if (!isPublicPath && !token) {
        // If user is not logged in and trying to access protected pages, redirect to login
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Role-based access control
    if (!isPublicPath && token) {
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jose.jwtVerify(token, secret);
            const role = payload.role as string;

            if (role === "employee") {
                const restrictedPaths = ["/assets", "/office-assets"];
                if (restrictedPaths.some(p => path.startsWith(p))) {
                    return NextResponse.redirect(new URL("/", request.nextUrl));
                }
            }
        } catch {
            return NextResponse.redirect(new URL("/login", request.nextUrl));
        }
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
