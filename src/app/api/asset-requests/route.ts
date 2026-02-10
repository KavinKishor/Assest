import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import AssetRequest from "@/lib/models/AssetRequest";
import User from "@/lib/models/User";
import Notification from "@/lib/models/Notification";
import { sendAssetRequestEmail } from "@/lib/email";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const query: Record<string, string> = {};
        if (category) query.category = category;

        // Associates only see their own requests
        if (session.role === "IT_Associate") {
            query["creator.userId"] = session.id;
        }

        const requests = await AssetRequest.find(query).sort({ createdAt: -1 });
        return NextResponse.json(requests);
    } catch {
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only IT Associates and IT Admins can create requests
        if (!["IT_Associate", "IT_Admin"].includes(session.role)) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const body = await req.json();
        const { type, category, section, assetData } = body;

        await connectToDatabase();

        // Safety check for session data
        const creatorName = session.name || "System User";
        const creatorRole = session.role || "IT_Associate";
        // Use undefined if email is missing to let Mongoose handle it as optional
        const creatorEmail = session.email || undefined;

        const count = await AssetRequest.countDocuments();
        const reqId = `REQ-${(count + 1).toString().padStart(4, "0")}`;

        const newRequest = await AssetRequest.create({
            reqId,
            type,
            category,
            section,
            assetData,
            creator: {
                userId: session.id,
                name: creatorName,
                email: creatorEmail,
                role: creatorRole
            },
            status: "Pending"
        });

        // Notify Managers and VPs
        const { notificationEmitter } = await import("@/lib/events");
        const managers = await User.find({ role: { $in: ["Manager", "VP"] } });

        for (const manager of managers) {
            const notif = await Notification.create({
                recipient: manager._id,
                sender: session.id,
                type: "Asset_Request",
                title: "New Asset Request",
                message: `${session.name} submitted a ${type} request for ${section} (${category}).`,
                link: "/ticket?tab=assets" // Since we integrated into tickets
            });
            notificationEmitter.emit("notification", notif);

            if (manager.email) {
                await sendAssetRequestEmail(
                    manager.email,
                    "New Asset Modification Request",
                    newRequest,
                    `A new ${type} request has been submitted by ${session.name}.`
                );
            }
        }

        // Notify IT Admins (System only)
        const admins = await User.find({ role: "IT_Admin" });
        for (const admin of admins) {
            if (admin._id.toString() !== session.id) {
                const notif = await Notification.create({
                    recipient: admin._id,
                    sender: session.id,
                    type: "Asset_Request",
                    title: "Asset Request Logged",
                    message: `${session.name} submitted a ${type} request for ${section}.`,
                    link: "/ticket?tab=assets"
                });
                notificationEmitter.emit("notification", notif);
            }
        }

        return NextResponse.json({ success: true, request: newRequest });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Asset request failed:", error);
        return NextResponse.json({ error: "Request submission failed" }, { status: 500 });
    }
}
