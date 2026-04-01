"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
    Plus, X, ChevronLeft, ChevronRight, Hash, User, MapPin, Layers, Calendar,
    Monitor, Layout, Lightbulb, Armchair, Wind, Droplets, Home, Battery,
    ShieldAlert, Truck, Smartphone, HardDrive, Archive, Umbrella, Cpu,
    Globe, Edit2, Trash2, Coffee, Flame, Sparkles, Bed, Tv, Refrigerator, Bath,
    Home as House, Fan, GlassWater, ScrollText, Layers as LayersIcon
} from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useLoading } from "@/hooks/use-loading";

// Reuse AssetCard for consistency
import { AssetCard } from "./assets";

const CATEGORIES = [
    { id: "overall", name: "Overall", icon: Globe, color: "blue" },
    { id: "electrical", name: "Electrical/Electronics", icon: Cpu, color: "blue" },
    { id: "devotional", name: "Devotional", icon: Flame, color: "orange" },
    { id: "cafeteria", name: "Cafeteria", icon: Coffee, color: "green" },
    { id: "indoor", name: "Indoor Assets", icon: Home, color: "purple" },
    { id: "cleaning", name: "Cleaning Accessories", icon: Sparkles, color: "indigo" },
    { id: "frontoffice", name: "Frontoffice Assets", icon: User, color: "red" },
    { id: "guesthouse", name: "Guest House Assets", icon: House, color: "teal" },
];

const SECTIONS = [
    { id: "desk", name: "Desks", icon: Layout, categoryId: "indoor" },
    { id: "lights", name: "Lights", icon: Lightbulb, categoryId: "electrical" },
    { id: "chairs", name: "Chairs", icon: Armchair, categoryId: "indoor" },
    { id: "ac", name: "Air Condition", icon: Wind, categoryId: "electrical" },
    { id: "ro facility", name: "RO Facility", icon: Droplets, categoryId: "cafeteria" },
    { id: "sofa", name: "Sofa", icon: Home, categoryId: "frontoffice" },
    { id: "ups and battery", name: "UPS & Battery", icon: Battery, categoryId: "electrical" },
    { id: "fireextinguisher", name: "Fire Extinguisher", icon: ShieldAlert, categoryId: "indoor" },
    { id: "vehicles", name: "Vehicles", icon: Truck, categoryId: "indoor" },
    { id: "mobile chargers", name: "Mobile Chargers", icon: Smartphone, categoryId: "electrical" },
    { id: "racks", name: "Racks", icon: HardDrive, categoryId: "indoor" },
    { id: "cupboards", name: "Cupboards", icon: Archive, categoryId: "indoor" },
    { id: "umbrella", name: "Umbrella", icon: Umbrella, categoryId: "indoor" },
    { id: "devotional", name: "Devotional Items", icon: Flame, categoryId: "devotional" },
    { id: "cleaning accessories", name: "Cleaning Assets", icon: Sparkles, categoryId: "cleaning" },
    // Guest House specific
    { id: "air cooler", name: "Air Coolers", icon: Wind, categoryId: "guesthouse" },
    { id: "bed", name: "Beds", icon: Bed, categoryId: "guesthouse" },
    { id: "pillows", name: "Pillows", icon: ScrollText, categoryId: "guesthouse" },
    { id: "bed sheet", name: "Bed Sheets", icon: ScrollText, categoryId: "guesthouse" },
    { id: "bed cover", name: "Bed Covers", icon: LayersIcon, categoryId: "guesthouse" },
    { id: "plastic rack", name: "Plastic Racks", icon: HardDrive, categoryId: "guesthouse" },
    { id: "fan", name: "Fans", icon: Fan, categoryId: "guesthouse" },
    { id: "glass tumbler", name: "Glass Tumblers", icon: GlassWater, categoryId: "guesthouse" },
    { id: "wardrobe", name: "Wardrobes", icon: Archive, categoryId: "guesthouse" },
    { id: "television", name: "Televisions", icon: Tv, categoryId: "guesthouse" },
    { id: "refrigerator", name: "Refrigerators", icon: Refrigerator, categoryId: "guesthouse" },
    { id: "geyser", name: "Geysers", icon: Bath, categoryId: "guesthouse" },
    { id: "guest house others", name: "Other GH Assets", icon: House, categoryId: "guesthouse" },
    { id: "others", name: "Others", icon: Cpu, categoryId: "indoor" },
];

const ICON_OPTIONS = [
    { name: "Box", icon: Layout },
    { name: "Monitor", icon: Monitor },
    { name: "Flash", icon: Lightbulb },
    { name: "Chair", icon: Armchair },
    { name: "Wind", icon: Wind },
    { name: "Droplet", icon: Droplets },
    { name: "Home", icon: Home },
    { name: "Battery", icon: Battery },
    { name: "Truck", icon: Truck },
    { name: "Phone", icon: Smartphone },
    { name: "Drive", icon: HardDrive },
    { name: "Archive", icon: Archive },
    { name: "Fan", icon: Fan },
    { name: "Glass", icon: GlassWater },
    { name: "Paper", icon: ScrollText },
    { name: "Bed", icon: Bed },
    { name: "TV", icon: Tv },
    { name: "Fridge", icon: Refrigerator },
    { name: "Bath", icon: Bath },
    { name: "Star", icon: Sparkles },
    { name: "Coffee", icon: Coffee },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, React.ComponentType<any>> = {
    Box: Layout, Monitor, Layout, Lightbulb, Armchair, Wind, Droplets, Home, Battery,
    Truck, Smartphone, HardDrive, Archive, Fan, GlassWater, ScrollText, Bed, Tv,
    Refrigerator, Bath, Sparkles, Coffee, Cpu, Globe, User, MapPin, Layers, Calendar,
    ShieldAlert, Umbrella, Flame,
};


const UNIFIED_HEADERS = [
    { label: "S.NO", key: "index" },
    { label: "ASSET ID", key: "assetId", icon: Hash },
    { label: "VENDOR", key: "vendor", icon: User },
    { label: "LOCATION", key: "location", icon: MapPin },
    { label: "QUANTITY", key: "quantity", icon: Layers },
    { label: "DATE OF PURCHASE", key: "dateOfPurchase", icon: Calendar },
    { label: "STATUS", key: "status" },
    { label: "REMARKS", key: "remarks" }
];

const COLORS = ["blue", "green", "orange", "purple", "red", "indigo", "pink"];

export default function OfficeAssets() {
    const [activeSection, setActiveSection] = useState("overall");
    const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
    const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);
    const [summaryCounts, setSummaryCounts] = useState<Record<string, number>>({});
    const [, setLoading] = useState(true);
    const [selectedAssetType, setSelectedAssetType] = useState("desk");
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [dynamicSections, setDynamicSections] = useState<{ id: string; name: string; icon: React.ComponentType<{ size?: number }>; categoryId: string; isDynamic: boolean }[]>([]);
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
    const [newSectionData, setNewSectionData] = useState({ name: "", iconName: "Box" });
    const navRef = useRef<HTMLDivElement>(null);
    const { withLoading } = useLoading();

    const fetchDynamicSections = useCallback(async () => {
        try {
            const res = await fetch("/api/office-assets/sections");
            const data = await res.json();
            setDynamicSections(data.map((s: { slug: string; name: string; iconName: string; categoryId: string }) => ({
                id: s.slug,
                name: s.name,
                icon: ICON_MAP[s.iconName] || ICON_MAP.Box,
                categoryId: s.categoryId,
                isDynamic: true
            })));
        } catch { /* silent */ }
    }, []);

    const fetchUserRole = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUserRole(data.user.role);
            }
        } catch { /* silent */ }
    };

    const fetchSummary = async () => {
        try {
            const res = await fetch("/api/office-assets/summary");
            const data = await res.json();
            setSummaryCounts(data);
        } catch {
            toast.error("Failed to fetch office assets summary");
        }
    };

    const fetchTableData = useCallback(async (section: string) => {
        if (section === "overall") return;
        setLoading(true);
        await withLoading(async () => {
            try {
                const res = await fetch(`/api/office-assets/${encodeURIComponent(section)}`);
                const data = await res.json();
                setTableData(data);
            } catch {
                toast.error("Failed to fetch office assets data");
            } finally {
                setLoading(false);
            }
        });
    }, [withLoading]);

    useEffect(() => {
        fetchUserRole();
        fetchSummary();
        fetchDynamicSections();
    }, [fetchDynamicSections]);

    const allSections = useMemo(() => [...SECTIONS, ...dynamicSections], [dynamicSections]);

    useEffect(() => {
        const isSection = allSections.some(s => s.id === activeSection);
        if (isSection) {
            fetchTableData(activeSection);
        }
    }, [activeSection, fetchTableData, allSections]);

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        await withLoading(async () => {
            try {
                const res = await fetch("/api/office-assets/sections", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...newSectionData,
                        categoryId: activeSection,
                        categoryType: "Office"
                    }),
                });

                if (res.ok) {
                    toast.success("Section Created Successfully");
                    setIsAddSectionOpen(false);
                    setNewSectionData({ name: "", iconName: "Box" });
                    fetchDynamicSections();
                    fetchSummary();
                } else {
                    const result = await res.json();
                    toast.error(result.error || "Failed to create section");
                }
            } catch {
                toast.error("Network Error");
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const action = editingId ? "UPDATE" : "CREATE";
        const endpoint = "/api/asset-requests";

        await withLoading(async () => {
            try {
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: action,
                        category: "Office_Assets",
                        section: editingId ? activeSection : selectedAssetType,
                        assetData: editingId ? { ...formData, _id: editingId } : formData
                    }),
                });

                if (res.ok) {
                    toast.success(`${action} Request Submitted for Approval`, {
                        icon: '🚀',
                        style: { borderRadius: '14px', background: '#333', color: '#fff' }
                    });
                    setIsAddEntryOpen(false);
                    setFormData({});
                    setEditingId(null);
                } else {
                    const result = await res.json();
                    toast.error(result.error || "Request Failed");
                }
            } catch {
                toast.error("Network Error. Try again.");
            }
        });
    };

    const handleDelete = (item: Record<string, unknown>) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span className="text-sm font-bold uppercase tracking-tight">Request Deletion?</span>
                <p className="text-xs text-gray-500">This will submit a deletion request for manager approval.</p>
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
                                            category: "Office_Assets",
                                            section: activeSection,
                                            assetData: item
                                        }),
                                    });
                                    if (res.ok) toast.success("Deletion Request Submitted");
                                    else toast.error("Request Failed");
                                } catch { toast.error("Network Error"); }
                            });
                        }}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg font-bold hover:bg-red-600"
                    >
                        Submit
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-lg font-bold">Cancel</button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const scroll = (direction: "left" | "right") => {
        if (navRef.current) {
            const { scrollLeft } = navRef.current;
            const scrollTo = direction === "left" ? scrollLeft - 200 : scrollLeft + 200;
            navRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (userRole === "employee") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <ShieldAlert size={64} className="text-red-500 opacity-20" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Access Restricted</h2>
                <p className="text-gray-500 font-medium text-center">You do not have permission to view Office Assets.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
            <div className="sticky top-16 z-30 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b dark:border-gray-800 px-4 py-3">
                <div className="relative max-w-7xl mx-auto flex items-center">
                    <button onClick={() => scroll("left")} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2 hidden md:block group">
                        <ChevronLeft size={20} className="text-gray-500 group-hover:text-blue-600" />
                    </button>
                    <div ref={navRef} className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth px-1">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveSection(cat.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all",
                                    activeSection === cat.id || allSections.find(s => s.id === activeSection)?.categoryId === cat.id
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 scale-105"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                )}
                            >
                                <cat.icon size={16} /> {cat.name}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => scroll("right")} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ml-2 hidden md:block group">
                        <ChevronRight size={20} className="text-gray-500 group-hover:text-blue-600" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/10">
                            {(() => {
                                const cat = CATEGORIES.find(c => c.id === activeSection);
                                const sec = allSections.find(s => s.id === activeSection);
                                const Icon = cat?.icon || sec?.icon || Monitor;
                                return <Icon size={28} />;
                            })()}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {activeSection === 'overall' ? 'OFFICE ASSETS' :
                                    (CATEGORIES.find(c => c.id === activeSection)?.name || SECTIONS.find(s => s.id === activeSection)?.name)}
                            </h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {activeSection === "overall" ? `Tracking Office Inventory` :
                                    allSections.some(s => s.id === activeSection) ? `Total ${summaryCounts[activeSection] || 0} items` :
                                        `Explore ${CATEGORIES.find(c => c.id === activeSection)?.name}`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const nextOpen = !isAddEntryOpen;
                            setIsAddEntryOpen(nextOpen);
                            if (!nextOpen) { setEditingId(null); setFormData({}); }
                            else if (!editingId) {
                                if (activeSection === "overall") {
                                    setSelectedAssetType("desk");
                                } else if (CATEGORIES.some(c => c.id === activeSection)) {
                                    const firstSec = allSections.find(s => s.categoryId === activeSection);
                                    setSelectedAssetType(firstSec ? firstSec.id : "desk");
                                } else {
                                    setSelectedAssetType(activeSection);
                                }
                            }
                        }}
                        className={clsx("flex items-center gap-2 px-8 py-3 rounded-2xl font-black transition-all shadow-xl active:scale-95", isAddEntryOpen ? "bg-red-500 text-white" : "bg-blue-600 text-white")}
                    >
                        {isAddEntryOpen ? <X size={20} /> : <Plus size={20} />}
                        {isAddEntryOpen ? "Close Panel" : "Add Office Asset"}
                    </button>
                </div>

                {isAddEntryOpen && (
                    <div className="bg-white dark:bg-card rounded-3xl border-2 border-blue-500/10 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 border-l-4 border-blue-600 pl-4">{editingId ? 'Modify' : 'Register New'} Office Asset</h3>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                {!editingId && (
                                    <div className="md:col-span-1 lg:col-span-1">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Asset Category</label>
                                        <select
                                            value={selectedAssetType}
                                            onChange={(e) => { setSelectedAssetType(e.target.value); setFormData({}); }}
                                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-base font-bold outline-none focus:border-blue-500 transition-all appearance-none"
                                        >
                                            {CATEGORIES.filter(c => c.id !== 'overall').map(cat => (
                                                <optgroup key={cat.id} label={cat.name} className="bg-white dark:bg-gray-800 text-gray-500">
                                                    {allSections.filter(s => s.categoryId === cat.id).map(s => (
                                                        <option key={s.id} value={s.id} className="text-gray-900 dark:text-white font-bold">{s.name}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {UNIFIED_HEADERS.filter(h => h.key !== 'index').map((h) => (
                                    <div key={h.key}>
                                        <label className="flex items-start gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                            {h.icon && <h.icon size={12} />}
                                            {h.label}
                                        </label>
                                        <input
                                            required={h.key === 'assetId'}
                                            type={h.key === 'quantity' ? 'number' : h.key.toLowerCase().includes('date') ? 'date' : 'text'}
                                            value={(formData[h.key] as string) || ""}
                                            onChange={(e) => setFormData({ ...formData, [h.key]: e.target.value })}
                                            placeholder={`Enter ${h.label.toLowerCase()}...`}
                                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                {editingId ? "Update Office Asset" : "Complete Registration"}
                            </button>
                        </form>
                    </div>
                )}

                {activeSection === "overall" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CATEGORIES.filter(c => c.id !== 'overall').map((cat, idx) => {
                            const catSections = allSections.filter(s => s.categoryId === cat.id);
                            const catCount = catSections.reduce((acc, s) => acc + (summaryCounts[s.id] || 0), 0);
                            return (
                                <div key={cat.id} className="group relative">
                                    <AssetCard
                                        title={cat.name}
                                        count={catCount}
                                        variant={COLORS[idx % COLORS.length] as "blue" | "green" | "orange" | "purple" | "red"}
                                        Icon={cat.icon}
                                        size="sm"
                                        onClick={() => setActiveSection(cat.id)}
                                    />
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {catSections.slice(0, 3).map(s => (
                                            <span key={s.id} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                                                {s.name}
                                            </span>
                                        ))}
                                        {catSections.length > 3 && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">+{catSections.length - 3}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : CATEGORIES.find(c => c.id === activeSection) ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white dark:bg-card p-4 rounded-2xl border dark:border-gray-800 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Available Sections</h3>
                            <button
                                onClick={() => setIsAddSectionOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                            >
                                <Plus size={16} /> Add Section
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {allSections.filter(s => s.categoryId === activeSection).map((section, idx) => (
                                <AssetCard
                                    key={section.id}
                                    title={section.name}
                                    count={summaryCounts[section.id] || 0}
                                    variant={COLORS[idx % COLORS.length] as "blue" | "green" | "orange" | "purple" | "red"}
                                    Icon={section.icon}
                                    size="sm"
                                    onClick={() => setActiveSection(section.id)}
                                />
                            ))}
                        </div>
                        {allSections.filter(s => s.categoryId === activeSection).length === 0 && (
                            <div className="text-center py-20 bg-white dark:bg-gray-900/40 rounded-3xl border-2 border-dashed dark:border-gray-800">
                                <p className="text-gray-400 font-bold uppercase tracking-widest italic">No asset types defined for this category yet</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-card rounded-[2.5rem] border dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-900/40 border-b dark:border-gray-800 text-left">
                                        {UNIFIED_HEADERS.map(h => (
                                            <th key={h.key} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h.label}</th>
                                        ))}
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.length === 0 ? (
                                        <tr><td colSpan={UNIFIED_HEADERS.length + 1} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic opacity-50">No items found in this section</td></tr>
                                    ) : (
                                        tableData.map((item, idx) => (
                                            <tr key={item._id as string} className="border-b dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-black text-gray-400 italic">{(idx + 1).toString().padStart(2, '0')}</td>
                                                {UNIFIED_HEADERS.slice(1).map(h => (
                                                    <td key={h.key} className="px-6 py-4">
                                                        <span className={clsx("text-sm font-bold tracking-tight", h.key === 'assetId' ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-200")}>
                                                            {String(item[h.key] || '-')}
                                                        </span>
                                                    </td>
                                                ))}
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingId(item._id as string); setFormData(item as Record<string, unknown>); setIsAddEntryOpen(true); }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl"
                                                        ><Edit2 size={16} /></button>
                                                        <button
                                                            onClick={() => handleDelete(item)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl"
                                                        ><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Section Modal */}
            {isAddSectionOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-card w-full max-w-md rounded-[2.5rem] border dark:border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center bg-indigo-600 text-white">
                            <h2 className="text-xl font-black uppercase tracking-tight">New Section</h2>
                            <button onClick={() => setIsAddSectionOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddSection} className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Section Name</label>
                                <input
                                    required
                                    value={newSectionData.name}
                                    onChange={e => setNewSectionData({ ...newSectionData, name: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. Paper Assets"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Select Icon</label>
                                <div className="grid grid-cols-6 gap-2 mt-2 h-40 overflow-y-auto p-2 border-2 dark:border-gray-700 rounded-2xl no-scrollbar">
                                    {ICON_OPTIONS.map(opt => (
                                        <button
                                            key={opt.name}
                                            type="button"
                                            onClick={() => setNewSectionData({ ...newSectionData, iconName: opt.name })}
                                            className={clsx(
                                                "p-3 rounded-xl flex items-center justify-center transition-all",
                                                newSectionData.iconName === opt.name ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            )}
                                        >
                                            <opt.icon size={20} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                Create Section
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
