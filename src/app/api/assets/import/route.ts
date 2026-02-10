import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ModelMap } from "@/lib/models/sections/AssetModels";
import * as XLSX from "xlsx";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const workbook = XLSX.read(buffer, { type: "buffer" });
        await connectToDatabase();

        let totalImported = 0;
        const results: Record<string, number> = {};

        // Mapping from sheet names to our ModelMap keys
        const sheetMap: Record<string, string> = {
            "Desktop": "desktop",
            "Laptop": "laptop",
            "Mobile": "mobile",
            "server": "server",
            "Firewall": "firewall",
            "Biometric": "biometric",
            "NAS": "nas",
            "CCTV": "cctv",
            "Printer": "printers",
            "Wifi": "wifi",
            "others": "other devices"
        };

        // Header mapping helper
        const headerMap: Record<string, string> = {
            "HOST NAME / ASSET ID": "hostNameAssetId",
            "CPU": "cpu",
            "PROCESSOR": "processor",
            "OPERATING SYSTEM": "os",
            "IP ADDRESS": "ipAddress", // Default, will handle special cases
            "MONITOR 1": "monitor1",
            "MONITOR 2": "monitor2",
            "KEYBOARD": "keyboard",
            "MOUSE": "mouse",
            "VOIP BRAND": "voipBrand",
            "EXTENSION 1": "extension1",
            "EXTENSION 2": "extension2",
            "VOIP HEADPHONE": "voipHeadphone",
            "USB HEADPHONE": "usbHeadphone",
            "VENDOR": "vendor",
            "LOCATION": "location",
            "BRAND": "brand",
            "MODEL": "model",
            "SERIAL NUMBER": "serialNumber",
            "MOBILE MODEL": "mobileModel",
            "TEAM": "team",
            "FIRMWARE VERSION": "firmwareVersion",
            "DEVICE MODEL": "deviceModel",
            "DEVICE TYPE": "deviceType",
            "DEVICE NAME": "deviceName",
            "MAC": "mac",
            "STORAGE": "storage",
            "TYPE": "type",
            "QUANTITY": "quantity"
        };

        for (const sheetName of workbook.SheetNames) {
            const modelKey = sheetMap[sheetName];
            if (!modelKey || !ModelMap[modelKey]) continue;

            const Model = ModelMap[modelKey];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];

            const processedData = data.map((row: Record<string, unknown>) => {
                const newRow: Record<string, unknown> = {};
                // Specific mappings for keys that might have duplicates or variations
                Object.entries(row).forEach(([key, value]) => {
                    const cleanKey = key.trim().toUpperCase();
                    let targetKey = headerMap[cleanKey] || key;

                    // Improved mapping for duplicate IP ADDRESS headers in Excel (xlsx names them "IP ADDRESS_1", etc.)
                    if (cleanKey.includes("IP ADDRESS")) {
                        if (modelKey === "desktop" || modelKey === "laptop") {
                            if (key.includes("_")) {
                                targetKey = "ipAddressVoip";
                            } else {
                                targetKey = "ipAddressHost";
                            }
                        } else if (modelKey === "server") {
                            targetKey = "ipAddressHost";
                        } else {
                            targetKey = "ipAddress";
                        }
                    }

                    // Map specific headers that might be slightly different
                    if (cleanKey === "OPERATING SYSTEM") targetKey = "os";
                    if (cleanKey === "HOST NAME / ASSET ID") targetKey = "hostNameAssetId";
                    if (cleanKey === "USB HEADPHONE") targetKey = "usbHeadphone";

                    newRow[targetKey] = value;
                });
                return newRow;
            });

            if (processedData.length > 0) {
                await Model.insertMany(processedData);
                results[sheetName] = processedData.length;
                totalImported += processedData.length;
            }
        }

        return NextResponse.json({
            message: `Successfully imported ${totalImported} assets across ${Object.keys(results).length} categories.`,
            details: results
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
