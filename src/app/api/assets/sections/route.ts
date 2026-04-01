import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Section from "@/lib/models/sections/Section";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const segments = new URL(req.url).pathname.split('/');
        // We can just query by categoryType: "IT"
        const sections = await Section.find({ categoryType: "IT" });
        return NextResponse.json(sections);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { name, iconName, categoryId, categoryType, fields } = body;

        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        const newSection = await Section.create({
            slug,
            name,
            iconName,
            categoryId,
            categoryType: categoryType || "IT",
            fields: fields || []
        });

        return NextResponse.json(newSection, { status: 201 });
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 11000) {
            return NextResponse.json({ error: "Section already exists" }, { status: 400 });
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
