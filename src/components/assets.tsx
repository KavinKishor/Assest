"use client";

import { useState, useRef, useEffect } from "react";
import {
    Monitor, Laptop, Smartphone, Server, Printer, Wifi,
    Keyboard, Mouse, Tv, Fingerprint, Cctv, Cpu,
    Globe, MonitorStop, ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2,
    HardDrive, Hash, User, MapPin, Layers, Calendar, Shield
} from "lucide-react";
import { FaHeadset, FaHeadphones } from 'react-icons/fa'
import clsx from "clsx";
import type { AssetVariant } from "@/types/asset";
import toast from "react-hot-toast";
import { useLoading } from "@/hooks/use-loading";
import Lottie from "lottie-react";
import loadingAnimation from "../../public/assestLoading.json";

// Icon mapping


type CardSize = "sm" | "md" | "lg";

export interface AssetCardProps {
    id?: string;
    title: string;
    count: number | string;
    variant?: AssetVariant;
    Icon?: React.ElementType;
    size?: CardSize;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
}

const sizeStyles: Record<CardSize, {
    container: string;
    icon: number;
    count: string;
    title: string;
}> = {
    sm: {
        container: "w-full min-w-[150px]",
        icon: 85,
        count: "text-4xl",
        title: "text-sm",
    },
    md: {
        container: "w-[180px]",
        icon: 120,
        count: "text-4xl",
        title: "text-sm",
    },
    lg: {
        container: "w-[220px]",
        icon: 150,
        count: "text-5xl",
        title: "text-base",
    },
};



const _variantColors: Record<AssetVariant, string> = {
    blue: "text-cyan-500",
    green: "text-emerald-500",
    orange: "text-orange-500",
    purple: "text-purple-500",
    red: "text-rose-500",
};

const _bottomLineColors: Record<AssetVariant, string> = {
    blue: "bg-cyan-500",
    green: "bg-emerald-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    red: "bg-rose-500",
};
const _variantStyles: Record<AssetVariant, string> = {
    blue: "from-cyan-500/10 to-blue-600/10 text-cyan-500 border-cyan-400/30",
    green: "from-lime-400/10 to-emerald-600/10 text-emerald-500 border-emerald-400/30",
    orange: "from-yellow-400/10 to-orange-600/10 text-orange-500 border-orange-400/30",
    purple: "from-fuchsia-500/10 to-purple-600/10 text-purple-500 border-purple-400/30",
    red: "from-rose-500/10 to-red-600/10 text-rose-500 border-red-400/30",
};

const lightVariantStyles: Record<AssetVariant, string> = {
    blue: "bg-blue-500/90 border-blue-400/20 text-white shadow-lg shadow-blue-500/10 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20",
    green: "bg-emerald-500/90 border-emerald-400/20 text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20",
    orange: "bg-orange-500/90 border-orange-400/20 text-white shadow-lg shadow-orange-500/10 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/20",
    purple: "bg-purple-500/90 border-purple-400/20 text-white shadow-lg shadow-purple-500/10 hover:bg-purple-600 hover:shadow-xl hover:shadow-purple-500/20",
    red: "bg-rose-500/90 border-rose-400/20 text-white shadow-lg shadow-rose-500/10 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/20",
};

const COLORS: AssetVariant[] = ["blue", "green", "orange", "purple", "red"];

export function AssetCard({
    title,
    count,
    variant = "blue",
    Icon = Monitor,
    loading = false,
    size = "sm",
    onClick,
    className
}: AssetCardProps) {
    if (loading) {
        return (
            <div className={clsx("aspect-square rounded-xl border bg-gray-100 dark:bg-gray-800 animate-pulse p-5", sizeStyles[size].container)}>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={clsx(
                "relative rounded-2xl border cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden group min-h-[130px]",
                sizeStyles[size].container,
                // Premium Light Mode - Solid Professional Colors
                lightVariantStyles[variant],
                "hover:-translate-y-2 hover:scale-[1.03]",
                // Dark Mode - Preserved (Vertical Layout)
                "dark:bg-card dark:border-white/5 dark:hover:border-white/80 dark:from-transparent dark:to-transparent dark:text-white dark:hover:bg-transparent",
                "dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.02)]",
                className
            )}
        >
            {/* Dark Mode Content (Now Horizontal Alignment) */}
            <div className="hidden dark:flex h-full w-full items-center justify-between p-6 gap-4">
                {/* Left side: Icon Section */}
                <div className="p-4 bg-white/5 rounded-2xl transition-all duration-700 group-hover:scale-110 group-hover:bg-white/10 group-hover:rotate-12 border border-white/5">
                    <Icon size={32} strokeWidth={1.5} className="text-white/40 group-hover:text-white transition-colors" />
                </div>

                {/* Right side: Text & Count Section */}
                <div className="flex flex-col items-end flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate mb-1 group-hover:text-white/60 transition-colors uppercase">{title}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-black tracking-tighter text-white/70 group-hover:text-white transition-colors">{count}</span>
                    </div>
                </div>
            </div>

            {/* Light Mode Content (Horizontal Business Standard) */}
            <div className="dark:hidden h-full w-full flex items-center justify-between p-6 gap-4">
                {/* Left side: Icon Section */}
                <div className="p-4 bg-white/20 rounded-2xl transition-all duration-700 group-hover:scale-110 group-hover:bg-white/30 shadow-inner group-hover:rotate-12">
                    <Icon size={35} strokeWidth={2.5} className="text-white drop-shadow-lg" />
                </div>

                {/* Right side: Text & Count Section */}
                <div className="flex flex-col items-end flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90 truncate mb-1">{title}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-black tracking-tighter text-white drop-shadow-lg">{count}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Line Animation (Dark mode only) */}
            <div className={clsx(
                "absolute bottom-0 left-0 right-0 h-[2px] transition-transform duration-500 scale-x-0 group-hover:scale-x-100 transform-gpu origin-center",
                "bg-white",
                "shadow-[0_0_8px_rgba(255,255,255,0.2)]",
                "hidden dark:block"
            )} />
        </div>
    );
}

const SECTIONS = [
    { id: "overall", name: "Overall", icon: Globe },
    { id: "desktop", name: "Desktop", icon: Monitor },
    { id: "laptop", name: "Laptop", icon: Laptop },
    { id: "server", name: "Server", icon: Server },
    { id: "printers", name: "Printers", icon: Printer },
    { id: "wifi", name: "Wifi", icon: Wifi },
    { id: "mobile", name: "Mobile", icon: Smartphone },
    { id: "firewall", name: "Firewall", icon: Tv },
    { id: "nas", name: "NAS", icon: Server },
    { id: "cctv", name: "CCTV", icon: Cctv },
    { id: "biometric", name: "Biometric", icon: Fingerprint },
    { id: "other devices", name: "Other Devices", icon: Cpu },
    { id: "voip", name: "Voip", icon: FaHeadset },
    { id: "usb headphones", name: "USB Headphones", icon: FaHeadphones },
    { id: "hard disk", name: "Hard Disk", icon: HardDrive },
    { id: "pendrive", name: "Pendrive", icon: Hash },
    { id: "moniters", name: "Moniters", icon: MonitorStop },
    { id: "keyboards", name: "Keyboards", icon: Keyboard },
    { id: "mouse", name: "Mouse", icon: Mouse },
];

const SECTION_TABLE_HEADERS: Record<string, { label: string; key: string; icon?: React.ElementType }[]> = {
    desktop: [
        { label: "S NO", key: "index" },
        { label: "HOST NAME / ASSET ID", key: "hostNameAssetId" },
        { label: "CPU", key: "cpu" },
        { label: "PROCESSOR", key: "processor" },
        { label: "OPERATING SYSTEM", key: "os" },
        { label: "IP ADDRESS", key: "ipAddressHost" },
        { label: "MONITOR 1", key: "monitor1" },
        { label: "MONITOR 2", key: "monitor2" },
        { label: "KEYBOARD", key: "keyboard" },
        { label: "MOUSE", key: "mouse" },
        { label: "VOIP BRAND", key: "voipBrand" },
        { label: "IP ADDRESS", key: "ipAddressVoip" },
        { label: "EXTENSION 1", key: "extension1" },
        { label: "EXTENSION 2", key: "extension2" },
        { label: "VOIP HEADPHONE", key: "voipHeadphone" },
        { label: "USB HEADPHONE", key: "usbHeadphone" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    laptop: [
        { label: "S NO", key: "index" },
        { label: "HOST NAME / ASSET ID", key: "hostNameAssetId" },
        { label: "BRAND", key: "brand" },
        { label: "MODEL", key: "model" },
        { label: "SERIAL NUMBER", key: "serialNumber" },
        { label: "PROCESSOR", key: "processor" },
        { label: "OPERATING SYSTEM", key: "os" },
        { label: "IP ADDRESS", key: "ipAddressHost" },
        { label: "MONITOR 1", key: "monitor1" },
        { label: "MONITOR 2", key: "monitor2" },
        { label: "KEYBOARD", key: "keyboard" },
        { label: "MOUSE", key: "mouse" },
        { label: "VOIP BRAND", key: "voipBrand" },
        { label: "IP ADDRESS", key: "ipAddressVoip" },
        { label: "EXTENSION 1", key: "extension1" },
        { label: "EXTENSION 2", key: "extension2" },
        { label: "VOIP HEADPHONE", key: "voipHeadphone" },
        { label: "USB HEADPHONE", key: "usbHeadphone" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    server: [
        { label: "S NO", key: "index" },
        { label: "HOST NAME / ASSET ID", key: "hostNameAssetId" },
        { label: "CPU", key: "cpu" },
        { label: "PROCESSOR", key: "processor" },
        { label: "OPERATING SYSTEM", key: "os" },
        { label: "IP ADDRESS", key: "ipAddressHost" },
        { label: "MONITOR 1", key: "monitor1" },
        { label: "KEYBOARD", key: "keyboard" },
        { label: "MOUSE", key: "mouse" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    printers: [
        { label: "S NO", key: "index" },
        { label: "BRAND", key: "brand" },
        { label: "MODEL", key: "model" },
        { label: "SERIAL NUMBER", key: "serialNumber" },
        { label: "TYPE", key: "type" },
        { label: "IP ADDRESS", key: "ipAddress" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    wifi: [
        { label: "S NO", key: "index" },
        { label: "BRAND", key: "brand" },
        { label: "MODEL", key: "model" },
        { label: "SERIAL NUMBER", key: "serialNumber" },
        { label: "MAC", key: "mac" },
        { label: "IP ADDRESS", key: "ipAddress" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    mobile: [
        { label: "S.NO", key: "index" },
        { label: "MOBILE MODEL", key: "mobileModel" },
        { label: "TEAM", key: "team" },
        { label: "LOCATION", key: "location" }
    ],
    firewall: [
        { label: "S NO", key: "index" },
        { label: "HOST NAME / ASSET ID", key: "hostNameAssetId" },
        { label: "BRAND", key: "brand" },
        { label: "MODEL", key: "model" },
        { label: "SERIAL NUMBER", key: "serialNumber" },
        { label: "FIRMWARE VERSION", key: "firmwareVersion" },
        { label: "IP ADDRESS", key: "ipAddress" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    nas: [
        { label: "S NO", key: "index" },
        { label: "BRAND", key: "brand" },
        { label: "MODEL", key: "model" },
        { label: "SERIAL NUMBER", key: "serialNumber" },
        { label: "FIRMWARE VERSION", key: "firmwareVersion" },
        { label: "IP ADDRESS", key: "ipAddress" },
        { label: "STORAGE", key: "storage" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    cctv: [
        { label: "S NO", key: "index" },
        { label: "DEVICE NAME", key: "deviceName" },
        { label: "MODEL", key: "model" },
        { label: "SERIAL NUMBER", key: "serialNumber" },
        { label: "FIRMWARE VERSION", key: "firmwareVersion" },
        { label: "IP ADDRESS", key: "ipAddress" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    "other devices": [
        { label: "S NO", key: "index" },
        { label: "BRAND", key: "brand" },
        { label: "DEVICE NAME", key: "deviceName" },
        { label: "QUANTITY", key: "quantity" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ],
    biometric: [
        { label: "S NO", key: "index" },
        { label: "DEVICE MODEL", key: "deviceModel" },
        { label: "DEVICE TYPE", key: "deviceType" },
        { label: "DEVICE NAME", key: "deviceName" },
        { label: "IP ADDRESS", key: "ipAddress" },
        { label: "MAC", key: "mac" },
        { label: "VENDOR", key: "vendor" },
        { label: "LOCATION", key: "location" }
    ]
};

const UNIFIED_HEADERS = [
    { label: "S.NO", key: "index" },
    { label: "ASSET ID", key: "assetId", icon: Hash },
    { label: "VENDOR", key: "vendor", icon: User },
    { label: "LOCATION", key: "location", icon: MapPin },
    { label: "QUANTITY", key: "quantity", icon: Layers },
    { label: "DATE OF PURCHASE", key: "dateOfPurchase", icon: Calendar },
];

export default function Assets() {
    const [activeSection, setActiveSection] = useState("overall");
    const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
    const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);
    const [summaryCounts, setSummaryCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [selectedAssetType, setSelectedAssetType] = useState("desktop");
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [_importing, setImporting] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navRef = useRef<HTMLDivElement>(null);

    const getHeaders = (section: string) => {
        return SECTION_TABLE_HEADERS[section] || UNIFIED_HEADERS;
    };

    const formatIST = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };
    const fetchUserRole = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUserRole(data.user.role);
            }
        } catch {
            // silent error
        }
    };

    const { withLoading } = useLoading();

    const fetchSummary = async () => {
        try {
            const res = await fetch("/api/assets/summary");
            const data = await res.json();
            setSummaryCounts(data);
        } catch {
            toast.error("Failed to fetch summary");
        }
    };

    const fetchTableData = async (section: string) => {
        if (section === "overall") {
            setLoading(false);
            return;
        }
        setLoading(true);
        await withLoading(async () => {
            try {
                const res = await fetch(`/api/assets/${encodeURIComponent(section)}`);
                const data = await res.json();
                setTableData(data);
            } catch {
                toast.error("Failed to fetch table data");
            } finally {
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    useEffect(() => {
        fetchSummary();
        if (activeSection !== "overall") {
            fetchTableData(activeSection);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection]);

    // Derived state for headers
    const currentHeaders = getHeaders(activeSection);
    const formHeaders = getHeaders(selectedAssetType);

    if (userRole === "employee") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Shield size={64} className="text-red-500 opacity-20" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Access Restricted</h2>
                <p className="text-gray-500 font-medium">You do not have permission to view IT Assets.</p>
            </div>
        );
    }

    if (!userRole) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: 96, height: 96 }}
                />
            </div>
        );
    }

    const scroll = (direction: "left" | "right") => {
        if (navRef.current) {
            const { scrollLeft } = navRef.current;
            const scrollTo = direction === "left" ? scrollLeft - 200 : scrollLeft + 200;
            navRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const handleEdit = (item: Record<string, unknown>) => {
        setEditingId((item._id as string) || null);
        const headers = getHeaders(activeSection);
        const initialForm: Record<string, unknown> = {};
        headers.forEach(h => {
            if (h.key !== 'index') initialForm[h.key] = (item[h.key] as string) || "";
        });
        setFormData(initialForm);
        setSelectedAssetType(activeSection);
        setIsAddEntryOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare Request Body
        const type = editingId ? "UPDATE" : "CREATE";
        const targetSection = editingId ? activeSection : selectedAssetType;
        const body = editingId ? { ...formData, id: editingId } : formData;

        await withLoading(async () => {
            try {
                // Determine API endpoint based on logic: Always Create Request
                const res = await fetch("/api/asset-requests", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type,
                        category: "IT_Assets",
                        section: targetSection,
                        assetData: body
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setIsAddEntryOpen(false);
                    setFormData({});
                    setEditingId(null);
                    toast.success("Request Submitted for Approval!", {
                        duration: 5000,
                        icon: '🛡️',
                        style: {
                            background: '#3B82F6',
                            color: '#fff',
                            borderRadius: '12px',
                        },
                    });
                } else {
                    toast.error(result.error || "Request Failed", {
                        style: { background: '#EF4444', color: '#fff' }
                    });
                }
            } catch {
                toast.error("Network Error. Try again.");
            }
        });
    };

    const handleDelete = (item: Record<string, unknown>) => {
        toast((t: { id: string }) => (
            <div className="flex flex-col gap-3">
                <span className="text-sm font-bold">Request Deletion?</span>
                <p className="text-xs text-gray-500">This will submit a deletion request for approval.</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            await withLoading(async () => {
                                try {
                                    const res = await fetch("/api/asset-requests", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            type: "DELETE",
                                            category: "IT_Assets",
                                            section: activeSection,
                                            assetData: item
                                        }),
                                    });
                                    if (res.ok) {
                                        toast.success("Deletion Request Submitted", { icon: '�️' });
                                    } else {
                                        const err = await res.json();
                                        toast.error(err.error || "Request Failed");
                                    }
                                } catch {
                                    toast.error("Network Error");
                                }
                            });
                        }}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg font-bold hover:bg-red-600 transition-colors"
                    >
                        Submit Request
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 8000,
            style: { border: '1px solid #E5E7EB', borderRadius: '16px' }
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setImporting(true);
        await withLoading(async () => {
            try {
                const res = await fetch("/api/assets/import", {
                    method: "POST",
                    body: formData,
                });
                const result = await res.json();
                if (res.ok) {
                    toast.success(result.message || "Imported successfully!", {
                        duration: 5000,
                        icon: '📦'
                    });
                    setIsImportModalOpen(false);
                    fetchSummary();
                    if (activeSection !== "overall") {
                        fetchTableData(activeSection);
                    }
                } else {
                    toast.error(result.error || "Import failed");
                }
            } catch {
                toast.error("Network error during import");
            } finally {
                setImporting(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        });
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-background">
            {/* Horizontal Nav */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b dark:border-gray-800 px-4 py-3 rounded-md">
                <div className="relative max-w-7xl mx-auto flex items-center">
                    <button onClick={() => scroll("left")} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mr-2 hidden md:block group">
                        <ChevronLeft size={20} className="text-gray-500 group-hover:text-blue-600 rounded-full" />
                    </button>
                    <div ref={navRef} className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth px-1">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all",
                                    activeSection === section.id
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 scale-105"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                )}
                            >
                                <section.icon size={16} /> {section.name}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => scroll("right")} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-2 hidden md:block group">
                        <ChevronRight size={20} className="text-gray-500 group-hover:text-blue-600" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
                            {(() => { const SectionIcon = SECTIONS.find(s => s.id === activeSection)?.icon || Monitor; return <SectionIcon size={28} />; })()}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{activeSection === 'overall' ? 'ASSET MGMT' : SECTIONS.find(s => s.id === activeSection)?.name}</h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {activeSection === "overall"
                                    ? `Centralized tracking for ${SECTIONS.length - 1} asset categories`
                                    : `Total ${summaryCounts[activeSection] || 0} items tracked in this category`}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {activeSection === "overall" && (
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                            >
                                <Layers size={20} />
                                Bulk Import
                            </button>
                        )}
                        <button
                            onClick={() => {
                                const nextOpen = !isAddEntryOpen;
                                setIsAddEntryOpen(nextOpen);
                                if (nextOpen) {
                                    if (!editingId) {
                                        const defaultCat = activeSection === "overall" ? SECTIONS[1].id : activeSection;
                                        setSelectedAssetType(defaultCat);
                                    }
                                } else {
                                    setEditingId(null);
                                    setFormData({});
                                }
                            }}
                            className={clsx("flex items-center gap-2 px-8 py-3 rounded-2xl font-black transition-all shadow-xl active:scale-95", isAddEntryOpen ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20")}
                        >
                            {isAddEntryOpen ? <X size={20} /> : <Plus size={20} />}
                            {isAddEntryOpen ? "Close Panel" : editingId ? "Edit Entry" : "Add Asset"}
                        </button>
                    </div>
                </div>

                {/* Dynamic Form */}
                {isAddEntryOpen && (
                    <div className="bg-white dark:bg-card rounded-3xl border-2 border-blue-500/10 dark:border-blue-500/5 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{editingId ? 'Modify' : 'Register New'} Asset</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {!editingId && (
                                <div>
                                    <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-2 px-1">Asset Category</label>
                                    <div className="relative group">
                                        <select
                                            value={selectedAssetType}
                                            onChange={(e) => { setSelectedAssetType(e.target.value); setFormData({}); }}
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700/50 rounded-2xl text-base font-bold text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
                                        >
                                            {SECTIONS.filter(s => s.id !== 'overall').map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <ChevronRight className="rotate-90" size={18} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                {formHeaders.filter(h => h.key !== 'index').map((h) => (
                                    <div key={h.key}>
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-2 px-1">
                                            {h.icon && <h.icon size={12} />}
                                            {h.label}
                                        </label>
                                        <input
                                            type={h.key === 'quantity' ? 'number' : h.key.toLowerCase().includes('date') ? 'date' : 'text'}
                                            value={(formData[h.key] as string) || ""}
                                            onChange={(e) => setFormData({ ...formData, [h.key]: e.target.value })}
                                            placeholder={`Enter ${h.label.toLowerCase()}...`}
                                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t dark:border-gray-800">
                                <button type="submit" className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-2xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95">
                                    {editingId ? "Update Asset Identity" : "Complete Registration"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Overall Hero Grid */}
                {activeSection === "overall" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {SECTIONS.filter(s => s.id !== 'overall').map((section, idx) => (
                            <AssetCard
                                key={idx}
                                title={section.name}
                                count={summaryCounts[section.id] || 0}
                                variant={COLORS[idx % COLORS.length]}
                                Icon={section.icon}
                                size="sm"
                                onClick={() => setActiveSection(section.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Table Header & Search Placeholder */}
                        <div className="bg-white dark:bg-card p-6 rounded-3xl border dark:border-gray-800 shadow-sm flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Live Inventory Range</span>
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                                Showing {tableData.length} records in <span className="text-blue-500 font-bold uppercase">{activeSection}</span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-card rounded-[2rem] border-2 dark:border-gray-800 shadow-2xl shadow-black/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-white/5 border-b dark:border-gray-800">
                                            {currentHeaders.map((h, i) => (
                                                <th key={i} className="px-6 py-5 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{h.label}</th>
                                            ))}
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-gray-500">MODIFIED GTM+5:30</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-gray-500 sticky right-0 bg-gray-50 dark:bg-card z-10 text-center">OPS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-gray-50 dark:divide-gray-800">
                                        {loading ? (
                                            [1, 2, 3].map(i => (
                                                <tr key={i} className="animate-pulse">
                                                    {currentHeaders.map((_, j) => <td key={j} className="px-6 py-5"><div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div></td>)}
                                                    <td className="px-6 py-5"><div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-32"></div></td>
                                                    <td className="px-6 py-5"><div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-16 mx-auto"></div></td>
                                                </tr>
                                            ))
                                        ) : tableData.length === 0 ? (
                                            <tr>
                                                <td colSpan={currentHeaders.length + 2} className="p-24 text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                                        <Layers size={64} />
                                                        <p className="text-xl font-bold uppercase tracking-widest">Vault is Empty</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : tableData.map((item, idx) => (
                                            <tr key={(item._id as string) || idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                                                {currentHeaders.map((h, i) => (
                                                    <td key={i} className={clsx(
                                                        "px-6 py-5 text-sm font-bold transition-colors whitespace-nowrap",
                                                        (h.key.toLowerCase().includes('id') || h.key.toLowerCase().includes('name')) ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                                                    )}>
                                                        {h.key === "index" ? (
                                                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-[10px]">{(idx + 1).toString().padStart(2, '0')}</span>
                                                        ) : (item[h.key] as React.ReactNode) || "-"}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-5 text-[11px] text-gray-400 font-bold whitespace-nowrap">
                                                    {formatIST((item.updatedAt as string))}
                                                </td>
                                                <td className="px-6 py-5 sticky right-0 bg-white group-hover:bg-blue-50/30 dark:bg-card dark:group-hover:bg-blue-900/10 transition-colors z-10 shadow-[-10px_0_15px_rgba(0,0,0,0.03)] dark:shadow-none">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl shadow-sm transition-all hover:scale-110" title="Edit">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(item)} className="p-2 text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl shadow-sm transition-all hover:scale-110" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Import Modal */}
                {isImportModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border dark:border-gray-800 animate-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
                                        <Layers size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Bulk Import Assets</h3>
                                </div>
                                <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Upload an Excel file (.xlsx) containing multiple sheets for different asset categories. Each sheet name should match a category (e.g., Desktop, Laptop, Mobile).
                                </p>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group bg-gray-50/50 dark:bg-gray-800/50"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".xlsx"
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                            <Plus size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-black text-gray-900 dark:text-white">Click to upload file</p>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Excel spreadsheets only (.xlsx)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                                            <Layers size={18} />
                                        </div>
                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100 uppercase tracking-tight">Need a template?</p>
                                    </div>
                                    <a
                                        href="/api/assets/import/sample"
                                        download
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all shadow-lg active:scale-95"
                                    >
                                        Download Example.xlsx
                                    </a>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsImportModalOpen(false)}
                                        className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
