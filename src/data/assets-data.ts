import type { AssetSummary } from "@/types/asset";

interface AssetCategoryData {
    id: string;
    name: string;
    assets: AssetSummary[];
}

export const assetsData: AssetCategoryData[] = [
    {
        id: "desktop-voip",
        name: "Desktop and VOIP Assets",
        assets: [
            { id: "1", title: "CPU", count: 56, variant: "blue", iconName: "PcCase", category: "desktop-voip" },
            { id: "2", title: "PROCESSOR", count: 24, variant: "purple", iconName: "Cpu", category: "desktop-voip" },
            { id: "3", title: "OS", count: 42, variant: "orange", iconName: "MonitorCog", category: "desktop-voip" },
            { id: "4", title: "IP Address", count: 15, variant: "red", iconName: "Globe", category: "desktop-voip" },
            { id: "5", title: "Monitor 1", count: 128, variant: "green", iconName: "Monitor", category: "desktop-voip" },
            { id: "6", title: "Monitor 2", count: 128, variant: "green", iconName: "MonitorStop", category: "desktop-voip" },
            { id: "7", title: "Keyboards", count: 45, variant: "purple", iconName: "Keyboard", category: "desktop-voip" },
            { id: "8", title: "Mouse", count: 48, variant: "red", iconName: "Mouse", category: "desktop-voip" },
            { id: "9", title: "VOIP", count: 62, variant: "blue", iconName: "Headset", category: "desktop-voip" },
            { id: "10", title: "USB Headphones", count: 56, variant: "red", iconName: "FaHeadset", category: "desktop-voip" },
            { id: "11", title: "Extension 1", count: 12, variant: "green", iconName: "HdmiPort", category: "desktop-voip" },
            { id: "12", title: "Extension 2", count: 51, variant: "purple", iconName: "HdmiPort", category: "desktop-voip" },
            { id: "13", title: "Servers", count: 8, variant: "blue", iconName: "Server", category: "desktop-voip" },
            { id: "14", title: "Printers", count: 12, variant: "green", iconName: "Printer", category: "desktop-voip" },
            { id: "15", title: "Routers", count: 6, variant: "orange", iconName: "Wifi", category: "desktop-voip" },
            { id: "16", title: "Monitors", count: 62, variant: "blue", iconName: "Tv", category: "desktop-voip" },
            { id: "17", title: "Fingerprints", count: 62, variant: "blue", iconName: "Fingerprint", category: "desktop-voip" },
            { id: "18", title: "CCTV", count: 62, variant: "blue", iconName: "Cctv", category: "desktop-voip" },
        ],
    },
    {
        id: "laptop",
        name: "Laptop Assets",
        assets: [
            { id: "19", title: "Laptops", count: 12, variant: "green", iconName: "Laptop", category: "laptop" },
            { id: "20", title: "IP Address", count: 12, variant: "green", iconName: "Globe", category: "laptop" },
            { id: "21", title: "Keyboard", count: 128, variant: "green", iconName: "Keyboard", category: "laptop" },
            { id: "22", title: "Mouse", count: 128, variant: "green", iconName: "Mouse", category: "laptop" },
            { id: "23", title: "Monitor 1", count: 128, variant: "green", iconName: "Monitor", category: "laptop" },
            { id: "24", title: "Monitor 2", count: 128, variant: "green", iconName: "MonitorStop", category: "laptop" },
            { id: "25", title: "VOIP", count: 62, variant: "blue", iconName: "Headset", category: "laptop" },
            { id: "26", title: "USB Headphones", count: 56, variant: "red", iconName: "FaHeadset", category: "laptop" },
            { id: "27", title: "Extension 1", count: 12, variant: "green", iconName: "HdmiPort", category: "laptop" },
            { id: "28", title: "Extension 2", count: 51, variant: "purple", iconName: "HdmiPort", category: "laptop" },
        ],
    },
    {
        id: "server",
        name: "Server Assets",
        assets: [
            { id: "29", title: "Servers", count: 8, variant: "blue", iconName: "Server", category: "server" },
            { id: "30", title: "CPU", count: 12, variant: "green", iconName: "Printer", category: "server" },
            { id: "31", title: "Processors", count: 6, variant: "orange", iconName: "Wifi", category: "server" },
            { id: "32", title: "IP Address", count: 6, variant: "orange", iconName: "Wifi", category: "server" },
            { id: "33", title: "Monitors", count: 6, variant: "orange", iconName: "Wifi", category: "server" },
            { id: "34", title: "Keyboards", count: 6, variant: "orange", iconName: "Wifi", category: "server" },
            { id: "35", title: "Mouse", count: 6, variant: "orange", iconName: "Wifi", category: "server" },
        ],
    },
    {
        id: "firewall",
        name: "Firewall Assets",
        assets: [
            { id: "36", title: "Firewall", count: 8, variant: "blue", iconName: "Server", category: "firewall" },
        ],
    },
    {
        id: "bio-metric",
        name: "Bio Metric Assets",
        assets: [
            { id: "37", title: "Bio Metric", count: 8, variant: "blue", iconName: "Fingerprint", category: "bio-metric" },
        ],
    },
    {
        id: "nas",
        name: "NAS Assets",
        assets: [
            { id: "38", title: "NAS", count: 8, variant: "blue", iconName: "Server", category: "nas" },
            { id: "39", title: "IP Address", count: 12, variant: "green", iconName: "Globe", category: "nas" },
        ],
    },
    {
        id: "cctv",
        name: "CCTV Assets",
        assets: [
            { id: "40", title: "CCTV", count: 8, variant: "blue", iconName: "Cctv", category: "cctv" },
            { id: "41", title: "IP Address", count: 12, variant: "green", iconName: "Globe", category: "cctv" },
        ],
    },
    {
        id: "printer",
        name: "Printer Assets",
        assets: [
            { id: "42", title: "Printers", count: 8, variant: "blue", iconName: "Printer", category: "printer" },
            { id: "43", title: "IP Address", count: 12, variant: "green", iconName: "Globe", category: "printer" },
        ],
    },
    {
        id: "other",
        name: "Other Assets",
        assets: [
            { id: "44", title: "Other Assets", count: 8, variant: "blue", iconName: "Server", category: "other" },
            { id: "45", title: "IP Address", count: 12, variant: "green", iconName: "Globe", category: "other" },
        ],
    },
    {
        id: "wifi",
        name: "Wifi Assets",
        assets: [
            { id: "46", title: "Wifi", count: 8, variant: "blue", iconName: "Wifi", category: "wifi" },
            { id: "47", title: "IP Address", count: 12, variant: "green", iconName: "Globe", category: "wifi" },
        ],
    },
];
