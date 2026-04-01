import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { OfficeModelMap } from "@/lib/models/sections/OfficeAssetModels";

export async function GET() {
    try {
        await connectToDatabase();

        const counts: Record<string, number> = {};

        // Static sections
        await Promise.all(
            Object.keys(OfficeModelMap).map(async (key) => {
                counts[key] = await OfficeModelMap[key].countDocuments();
            })
        );

        // Dynamic sections
        const Section = (await import("@/lib/models/sections/Section")).default;
        const DynamicOfficeAsset = (await import("@/lib/models/sections/DynamicOfficeAsset")).default;
        const dynamicSections = await Section.find({ categoryType: "Office" });

        await Promise.all(
            dynamicSections.map(async (sec) => {
                counts[sec.slug] = await DynamicOfficeAsset.countDocuments({ sectionSlug: sec.slug });
            })
        );

        return NextResponse.json(counts);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
