import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ModelMap } from "@/lib/models/sections/AssetModels";
import Section from "@/lib/models/sections/Section";

export async function GET() {
    try {
        await connectToDatabase();

        const counts: Record<string, number> = {};

        // 1. Static models
        await Promise.all(
            Object.keys(ModelMap).map(async (key) => {
                try {
                    counts[key] = await ModelMap[key].countDocuments();
                } catch {
                    counts[key] = 0;
                }
            })
        );

        // 2. Dynamic sections (ensure they are included in summary even if not in StaticModelMap)
        const itSections = await Section.find({ categoryType: "IT" });
        for (const sec of itSections) {
            if (!counts[sec.slug]) {
                const Model = ModelMap[sec.slug];
                try {
                    counts[sec.slug] = await Model.countDocuments();
                } catch {
                    counts[sec.slug] = 0;
                }
            }
        }

        return NextResponse.json(counts);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
