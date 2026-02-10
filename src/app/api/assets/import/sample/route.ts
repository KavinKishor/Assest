import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        const workbook = XLSX.utils.book_new();

        const samples: Record<string, Record<string, unknown>[]> = {
            "Desktop": [{
                "HOST NAME / ASSET ID": "DSK-001",
                "CPU": "Intel i7",
                "PROCESSOR": "12th Gen",
                "OPERATING SYSTEM": "Windows 11",
                "IP ADDRESS": "192.168.1.10",
                "MONITOR 1": "Dell 24\"",
                "MONITOR 2": "Dell 24\"",
                "KEYBOARD": "Logitech K120",
                "MOUSE": "Logitech M100",
                "VOIP BRAND": "Cisco",
                "IP ADDRESS_1": "10.0.0.50",
                "EXTENSION 1": "101",
                "EXTENSION 2": "102",
                "VOIP HEADPHONE": "Jabra",
                "USB HEADPHONE": "Logitech H340",
                "VENDOR": "Acidus Systems",
                "LOCATION": "Acidus HO"
            }],
            "Laptop": [{
                "HOST NAME / ASSET ID": "LAP-001",
                "BRAND": "Apple",
                "MODEL": "MacBook Pro",
                "SERIAL NUMBER": "ABC123XYZ",
                "PROCESSOR": "M2 Pro",
                "OPERATING SYSTEM": "macOS",
                "IP ADDRESS": "192.168.1.15",
                "MONITOR 1": "-",
                "MONITOR 2": "-",
                "KEYBOARD": "Inbuilt",
                "MOUSE": "Trackpad",
                "VOIP BRAND": "-",
                "IP ADDRESS_1": "-",
                "EXTENSION 1": "-",
                "EXTENSION 2": "-",
                "VOIP HEADPHONE": "-",
                "USB HEADPHONE": "Sennheiser",
                "VENDOR": "Apple Store",
                "LOCATION": "Acidus Tidel"
            }],
            "Mobile": [{
                "MOBILE MODEL": "iPhone 15",
                "TEAM": "Development",
                "LOCATION": "Chennai"
            }],
            "server": [{
                "HOST NAME / ASSET ID": "SRV-001",
                "CPU": "Xeon Platinum",
                "PROCESSOR": "Dual Socket",
                "OPERATING SYSTEM": "Ubuntu 22.04",
                "IP ADDRESS": "192.168.1.100",
                "MONITOR 1": "Samsung 19\"",
                "KEYBOARD": "-",
                "MOUSE": "-",
                "VENDOR": "Dell",
                "LOCATION": "Data Center"
            }],
            "Firewall": [{
                "HOST NAME / ASSET ID": "FW-001",
                "BRAND": "Fortinet",
                "MODEL": "FG-60F",
                "SERIAL NUMBER": "FGT890",
                "FIRMWARE VERSION": "7.4.1",
                "IP ADDRESS": "192.168.1.1",
                "VENDOR": "Cyber Solutions",
                "LOCATION": "Acidus HO"
            }],
            "Biometric": [{
                "DEVICE MODEL": "ZKTeco K40",
                "DEVICE TYPE": "Fingerprint",
                "DEVICE NAME": "Main Entry",
                "IP ADDRESS": "192.168.1.25",
                "MAC": "00:1A:2B:3C:4D:5E",
                "VENDOR": "SecureSystems",
                "LOCATION": "Acidus Tidel"
            }],
            "NAS": [{
                "BRAND": "Synology",
                "MODEL": "DS923+",
                "SERIAL NUMBER": "SN-934",
                "FIRMWARE VERSION": "DSM 7.2",
                "IP ADDRESS": "192.168.1.20",
                "STORAGE": "16TB",
                "VENDOR": "TechMart",
                "LOCATION": "Acidus HO"
            }],
            "CCTV": [{
                "DEVICE NAME": "Front Port",
                "MODEL": "Hikvision 4MP",
                "SERIAL NUMBER": "HKV-002",
                "FIRMWARE VERSION": "V5.5.0",
                "IP ADDRESS": "192.168.1.40",
                "VENDOR": "EyeCare",
                "LOCATION": "Acidus JP"
            }],
            "Printer": [{
                "BRAND": "HP",
                "MODEL": "LaserJet Pro",
                "SERIAL NUMBER": "HP-394",
                "TYPE": "Network",
                "IP ADDRESS": "192.168.1.30",
                "VENDOR": "Acidus Systems",
                "LOCATION": "Acidus HO"
            }],
            "Wifi": [{
                "BRAND": "TP-Link",
                "MODEL": "Archer AX50",
                "SERIAL NUMBER": "TP-001",
                "MAC": "AA:BB:CC:DD:EE:FF",
                "IP ADDRESS": "192.168.1.2",
                "VENDOR": "Retail",
                "LOCATION": "Acidus JP"
            }],
            "others": [{
                "BRAND": "Logitech",
                "DEVICE NAME": "Presenter Remote",
                "QUANTITY": 5,
                "VENDOR": "Amazon",
                "LOCATION": "Various"
            }]
        };

        Object.entries(samples).forEach(([sheetName, data]) => {
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        return new Response(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=it_assets_sample.xlsx"
            }
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
