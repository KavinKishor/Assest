import type { NextRequest } from "next/server";
import { notificationEmitter } from "@/lib/events";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const stream = new ReadableStream({
        start(controller) {
            const userId = session.id;

            // Health check interval
            const keepAlive = setInterval(() => {
                try {
                    controller.enqueue(`: keep-alive\n\n`);
                } catch {
                    // Controller might be closed
                }
            }, 15000);

            const onNotification = (data: Record<string, unknown>) => {
                // Only send to the intended recipient
                // If data has recipient, check it. If it's plural (insertMany), we handle that in emit or here.
                // For simplicity, we assume we emit single objects or we filter here.
                if (String(data.recipient) === String(userId)) {
                    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
                }
            };

            notificationEmitter.on("notification", onNotification);

            // Clean up when connection closes
            req.signal.onabort = () => {
                clearInterval(keepAlive);
                notificationEmitter.off("notification", onNotification);
            };
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
}
