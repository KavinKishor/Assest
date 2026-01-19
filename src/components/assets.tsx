"use client";

import { useState, useRef, useEffect } from "react";
import {
    Monitor, Laptop, Smartphone, Tablet, Watch, Server, Printer, Wifi,
    Keyboard, Mouse, Tv, Fingerprint, Cctv, Headset, PcCase, Cpu,
    MonitorCog, Globe, MonitorStop, HdmiPort, ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2,
    Headphones, HardDrive, Hash, User, MapPin, Layers, Calendar
} from "lucide-react";
import { FaHeadset, FaHeadphones } from 'react-icons/fa'
import clsx from "clsx";
import { AssetVariant } from "@/types/asset";
import toast from "react-hot-toast";

// Icon mapping
const IconMap: Record<string, any> = {
    Monitor, Laptop, Smartphone, Tablet, Watch, Server, Printer, Wifi,
    Keyboard, Mouse, Tv, Fingerprint, Cctv, Headset, PcCase, Cpu,
    MonitorCog, Globe, MonitorStop, HdmiPort, FaHeadset, FaHeadphones,
    Headphones, HardDrive
};

type CardSize = "sm" | "md" | "lg";

export interface AssetCardProps {
    id?: string;
    title: string;
    count: number | string;
    variant?: AssetVariant;
    Icon?: any;
    size?: CardSize;
    loading?: boolean;
    onClick?: () => void;
}

const sizeStyles: Record<CardSize, {
    container: string;
    icon: number;
    count: string;
    title: string;
}> = {
    sm: {
        container: "w-full min-w-[140px]",
        icon: 70,
        count: "text-2xl",
        title: "text-[10px]",
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

const variantStyles: Record<AssetVariant, string> = {
    blue: "from-blue-500/20 to-blue-600/10 text-blue-600",
    green: "from-green-500/20 to-green-600/10 text-green-600",
    orange: "from-orange-500/20 to-orange-600/10 text-orange-600",
    purple: "from-purple-500/20 to-purple-600/10 text-purple-600",
    red: "from-red-500/20 to-red-600/10 text-red-600",
};

const COLORS: AssetVariant[] = ["blue", "green", "orange", "purple", "red"];

export function AssetCard({
    title,
    count,
    variant = "blue",
    Icon = Monitor,
    loading = false,
    size = "sm",
    onClick
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
                "relative aspect-square rounded-xl border overflow-hidden cursor-pointer",
                sizeStyles[size].container,
                "bg-white dark:bg-gray-900 group transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-xl hover:border-blue-500/50"
            )}
        >
            <div className={clsx("absolute inset-0 bg-gradient-to-br opacity-40", variantStyles[variant])} />
            {Icon && (
                <Icon size={sizeStyles[size].icon} strokeWidth={1} className={clsx("absolute left-[-20px] top-1/2 -translate-y-1/2 opacity-20 dark:opacity-30 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12", variantStyles[variant])} />
            )}
            <div className="relative z-10 h-full flex flex-col justify-center items-end pr-5">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-0.5">Total</span>
                <span className={clsx("font-extrabold text-gray-800 dark:text-gray-200 capitalize text-right leading-tight", sizeStyles[size].title)}>{title}</span>
                <span className={clsx("mt-0.5 font-black text-gray-900 dark:text-white drop-shadow-sm", sizeStyles[size].count)}>{count}</span>
            </div>
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
    { id: "other devices", name: "Other Devices", icon: Cpu },
    { id: "voip", name: "Voip", icon: FaHeadset },
    { id: "usb headphones", name: "USB Headphones", icon: FaHeadphones },
    { id: "hard disk", name: "Hard Disk", icon: HardDrive },
    { id: "pendrive", name: "Pendrive", icon: Hash },
    { id: "moniters", name: "Moniters", icon: MonitorStop },
    { id: "keyboards", name: "Keyboards", icon: Keyboard },
    { id: "mouse", name: "Mouse", icon: Mouse },
];

const SECTION_TABLE_HEADERS: Record<string, { label: string; key: string; icon?: any }[]> = {
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
    const [tableData, setTableData] = useState<any[]>([]);
    const [summaryCounts, setSummaryCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [selectedAssetType, setSelectedAssetType] = useState("desktop");
    const [formData, setFormData] = useState<any>({});
    const [editingId, setEditingId] = useState<string | null>(null);
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

    const fetchSummary = async () => {
        try {
            const res = await fetch("/api/assets/summary");
            const data = await res.json();
            setSummaryCounts(data);
        } catch (error) {
            console.error("Summary fetch error:", error);
        }
    };

    const fetchTableData = async (section: string) => {
        if (section === "overall") {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/assets/${encodeURIComponent(section)}`);
            const data = await res.json();
            setTableData(data);
        } catch (error) {
            console.error("Table fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
        if (activeSection !== "overall") {
            fetchTableData(activeSection);
        }
    }, [activeSection]);

    const scroll = (direction: "left" | "right") => {
        if (navRef.current) {
            const { scrollLeft } = navRef.current;
            const scrollTo = direction === "left" ? scrollLeft - 200 : scrollLeft + 200;
            navRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item._id);
        const headers = getHeaders(activeSection);
        const initialForm: any = {};
        headers.forEach(h => {
            if (h.key !== 'index') initialForm[h.key] = item[h.key] || "";
        });
        setFormData(initialForm);
        setSelectedAssetType(activeSection);
        setIsAddEntryOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const body = editingId ? { ...formData, id: editingId } : formData;
        const targetSection = editingId ? activeSection : selectedAssetType;

        try {
            const res = await fetch(`/api/assets/${encodeURIComponent(targetSection)}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setIsAddEntryOpen(false);
                setFormData({});
                setEditingId(null);
                if (activeSection === targetSection) {
                    fetchTableData(activeSection);
                }
                fetchSummary();
                toast.success(`${editingId ? 'Updated' : 'Registered'} Successfully!`, {
                    style: {
                        background: '#10B981',
                        color: '#fff',
                        borderRadius: '12px',
                    },
                    icon: '🚀'
                });
            } else {
                toast.error("Process Failed. Please check parameters.", {
                    style: { background: '#EF4444', color: '#fff' }
                });
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Network Error. Try again.");
        }
    };

    const handleDelete = () => {
        toast((t: any) => (
            <div className="flex flex-col gap-3">
                <span className="text-sm font-bold">Request Deletion?</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            toast.error("Manager approval required for deletion.", {
                                icon: '🔒',
                                style: { background: '#F59E0B', color: '#fff' }
                            });
                        }}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg font-bold"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-lg font-bold"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            style: { border: '1px solid #E5E7EB', borderRadius: '16px' }
        });
    };

    const currentHeaders = getHeaders(activeSection);
    const formHeaders = getHeaders(selectedAssetType);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
            {/* Horizontal Nav */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 px-4 py-3">
                <div className="relative max-w-7xl mx-auto flex items-center">
                    <button onClick={() => scroll("left")} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mr-2 hidden md:block group">
                        <ChevronLeft size={20} className="text-gray-500 group-hover:text-blue-600" />
                    </button>
                    <div ref={navRef} className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all",
                                    activeSection === section.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
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
                    <button
                        onClick={() => { setIsAddEntryOpen(!isAddEntryOpen); if (isAddEntryOpen) { setEditingId(null); setFormData({}); } }}
                        className={clsx("flex items-center gap-2 px-8 py-3 rounded-2xl font-black transition-all shadow-xl active:scale-95", isAddEntryOpen ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20")}
                    >
                        {isAddEntryOpen ? <X size={20} /> : <Plus size={20} />}
                        {isAddEntryOpen ? "Close Panel" : editingId ? "Edit Entry" : "Add Asset"}
                    </button>
                </div>

                {/* Dynamic Form */}
                {isAddEntryOpen && (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-blue-500/10 dark:border-blue-500/5 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{editingId ? 'Modify' : 'Register New'} Asset</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {!editingId && (
                                <div>
                                    <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-2 px-1">Asset Category</label>
                                    <select
                                        value={selectedAssetType}
                                        onChange={(e) => { setSelectedAssetType(e.target.value); setFormData({}); }}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 dark:border-gray-700/50 rounded-2xl text-base font-bold text-gray-800 dark:text-gray-200 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {SECTIONS.filter(s => s.id !== 'overall').map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
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
                                            value={formData[h.key] || ""}
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
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
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Live Inventory Range</span>
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                                Showing {tableData.length} records in <span className="text-blue-500 font-bold uppercase">{activeSection}</span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border-2 dark:border-gray-800 shadow-2xl shadow-black/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-gray-800">
                                            {currentHeaders.map((h, i) => (
                                                <th key={i} className="px-6 py-5 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{h.label}</th>
                                            ))}
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-gray-500">MODIFIED GTM+5:30</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[2px] text-gray-400 dark:text-gray-500 sticky right-0 bg-gray-50 dark:bg-gray-800 z-10 text-center">OPS</th>
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
                                            <tr key={item._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                                {currentHeaders.map((h, i) => (
                                                    <td key={i} className={clsx(
                                                        "px-6 py-5 text-sm font-bold transition-colors whitespace-nowrap",
                                                        (h.key.toLowerCase().includes('id') || h.key.toLowerCase().includes('name')) ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                                                    )}>
                                                        {h.key === "index" ? (
                                                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-[10px]">{(idx + 1).toString().padStart(2, '0')}</span>
                                                        ) : item[h.key] || "-"}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-5 text-[11px] text-gray-400 font-bold whitespace-nowrap">
                                                    {formatIST(item.updatedAt)}
                                                </td>
                                                <td className="px-6 py-5 sticky right-0 bg-white group-hover:bg-blue-50/30 dark:bg-gray-900 dark:group-hover:bg-blue-900/10 transition-colors z-10 shadow-[-10px_0_15px_rgba(0,0,0,0.03)] dark:shadow-none">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl shadow-sm transition-all hover:scale-110" title="Edit">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl shadow-sm transition-all hover:scale-110" title="Delete">
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
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
