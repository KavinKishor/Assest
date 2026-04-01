import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SoftwareModelMap } from "@/lib/models/sections/SoftwareModels";

export async function GET() {
    try {
        await connectToDatabase();

        const counts: Record<string, number> = {};

        await Promise.all(
            Object.keys(SoftwareModelMap).map(async (key) => {
                counts[key] = await SoftwareModelMap[key].countDocuments();
            })
        );

        return NextResponse.json(counts);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
