import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import AssetRequest from "@/lib/models/AssetRequest";
import Notification from "@/lib/models/Notification";
import { sendAssetRequestEmail } from "@/lib/email";
import { ModelMap } from "@/lib/models/sections/AssetModels";
import { OfficeModelMap } from "@/lib/models/sections/OfficeAssetModels";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only Manager or VP can approve/reject
        if (!["Manager", "VP"].includes(session.role)) {
            return NextResponse.json({ error: "Unauthorized role" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status, managerComment } = body;

        await connectToDatabase();

        const assetRequest = await AssetRequest.findById(id);
        if (!assetRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });

        if (status === "Approved") {
            const { type, category, section, assetData } = assetRequest;
            const model = category === "IT_Assets" ? ModelMap[section] : OfficeModelMap[section];

            if (!model) throw new Error("Invalid section model");

            if (type === "CREATE") {
                await model.create(assetData);
            } else if (type === "UPDATE") {
                const assetId = assetData._id || assetData.id;
                if (!assetId) throw new Error("Asset ID missing for update");
                const { _id, id: _, ...updateFields } = assetData;
                const updated = await model.findByIdAndUpdate(assetId, updateFields, { new: true });
                if (!updated) throw new Error("Asset to update not found");
            } else if (type === "DELETE") {
                const assetId = assetData._id || assetData.id;
                if (!assetId) throw new Error("Asset ID missing for delete");
                const deleted = await model.findByIdAndDelete(assetId);
                if (!deleted) throw new Error("Asset to delete not found");
            }
        }

        assetRequest.status = status;
        assetRequest.managerComment = managerComment;
        assetRequest.approver = {
            userId: new Types.ObjectId(session.id),
            name: session.name,
            role: session.role
        };
        await assetRequest.save();

        // Notify Creator
        const { notificationEmitter } = await import("@/lib/events");
        const notif = await Notification.create({
            recipient: assetRequest.creator.userId,
            sender: session.id,
            type: status === "Approved" ? "Asset_Approved" : "Asset_Rejected",
            title: `Asset Request ${status}`,
            message: `Your ${assetRequest.type} request for ${assetRequest.section} was ${status.toLowerCase()}. ${managerComment ? `Comment: ${managerComment}` : ""}`,
            link: "/ticket"
        });
        notificationEmitter.emit("notification", notif);

        if (assetRequest.creator.email) {
            await sendAssetRequestEmail(
                assetRequest.creator.email,
                `Asset Request ${status}`,
                assetRequest,
                `Your request has been ${status.toLowerCase()} by ${session.name}.`
            );
        }

        return NextResponse.json({ success: true, request: assetRequest });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Action execution failed:", error);
        return NextResponse.json({ error: "Action processing failed" }, { status: 500 });
    }
}
