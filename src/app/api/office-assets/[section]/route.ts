import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { OfficeModelMap } from "@/lib/models/sections/OfficeAssetModels";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ section: string }> }
) {
    try {
        await connectToDatabase();
        const { section } = await params;
        const decodedSection = decodeURIComponent(section).toLowerCase();
        const Model = OfficeModelMap[decodedSection];

        if (!Model) {
            return NextResponse.json({ error: "Invalid section" }, { status: 400 });
        }

        const data = await Model.find().sort({ createdAt: -1 });
        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ section: string }> }
) {
    try {
        await connectToDatabase();
        const { section } = await params;
        const decodedSection = decodeURIComponent(section).toLowerCase();
        const Model = OfficeModelMap[decodedSection];
        const body = await request.json();

        if (!Model) {
            return NextResponse.json({ error: "Invalid section" }, { status: 400 });
        }

        const newItem = await Model.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ section: string }> }
) {
    try {
        await connectToDatabase();
        const { section } = await params;
        const decodedSection = decodeURIComponent(section).toLowerCase();
        const Model = OfficeModelMap[decodedSection];
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!Model) {
            return NextResponse.json({ error: "Invalid section" }, { status: 400 });
        }

        const updatedItem = await Model.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedItem);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    _params: { params: Promise<{ section: string }> }
) {
    return NextResponse.json({ message: "Delete requires manager approval (Coming Soon)" }, { status: 403 });
}
