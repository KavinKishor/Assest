"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Plus, X, ChevronLeft, ChevronRight, Hash, User, MapPin, Layers, Calendar,
    Monitor, Layout, Lightbulb, Armchair, Wind, Droplets, Home, Battery,
    ShieldAlert, Truck, Smartphone, HardDrive, Archive, Umbrella, Cpu,
    Globe, Edit2, Trash2
} from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useLoading } from "@/hooks/use-loading";

// Reuse AssetCard for consistency
import { AssetCard } from "./assets";

const SECTIONS = [
    { id: "overall", name: "Overall", icon: Globe },
    { id: "desk", name: "Desks", icon: Layout },
    { id: "lights", name: "Lights", icon: Lightbulb },
    { id: "chairs", name: "Chairs", icon: Armchair },
    { id: "ac", name: "Air Condition", icon: Wind },
    { id: "ro facility", name: "RO Facility", icon: Droplets },
    { id: "sofa", name: "Sofa", icon: Home },
    { id: "ups and battery", name: "UPS & Battery", icon: Battery },
    { id: "fireextinguisher", name: "Fire Extinguisher", icon: ShieldAlert },
    { id: "vehicles", name: "Vehicles", icon: Truck },
    { id: "mobile chargers", name: "Mobile Chargers", icon: Smartphone },
    { id: "racks", name: "Racks", icon: HardDrive },
    { id: "cupboards", name: "Cupboards", icon: Archive },
    { id: "umbrella", name: "Umbrella", icon: Umbrella },
    { id: "others", name: "Others", icon: Cpu },
];

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

const COLORS = ["blue", "green", "orange", "purple", "red"];

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
    const navRef = useRef<HTMLDivElement>(null);
    const { withLoading } = useLoading();

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
    }, []);

    useEffect(() => {
        if (activeSection !== "overall") {
            fetchTableData(activeSection);
        }
    }, [activeSection, fetchTableData]);

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
        <div className="flex flex-col h-full bg-gray-50 dark:bg-background">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b dark:border-gray-800 px-4 py-3">
                <div className="relative max-w-7xl mx-auto flex items-center">
                    <button onClick={() => scroll("left")} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-2 hidden md:block group">
                        <ChevronLeft size={20} className="text-gray-500 group-hover:text-blue-600" />
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
                    <button onClick={() => scroll("right")} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ml-2 hidden md:block group">
                        <ChevronRight size={20} className="text-gray-500 group-hover:text-blue-600" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/10">
                            {(() => { const SectionIcon = SECTIONS.find(s => s.id === activeSection)?.icon || Monitor; return <SectionIcon size={28} />; })()}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{activeSection === 'overall' ? 'OFFICE ASSETS' : SECTIONS.find(s => s.id === activeSection)?.name}</h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {activeSection === "overall" ? `Tracking Office Inventory` : `Total ${summaryCounts[activeSection] || 0} items`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const nextOpen = !isAddEntryOpen;
                            setIsAddEntryOpen(nextOpen);
                            if (!nextOpen) { setEditingId(null); setFormData({}); }
                            else if (!editingId) setSelectedAssetType(activeSection === "overall" ? "desk" : activeSection);
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
                                            {SECTIONS.filter(s => s.id !== 'overall').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                )}
                                {UNIFIED_HEADERS.filter(h => h.key !== 'index').map((h) => (
                                    <div key={h.key}>
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                            {h.icon && <h.icon size={12} />}
                                            {h.label}
                                        </label>
                                        <input
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {SECTIONS.filter(s => s.id !== 'overall').map((section, idx) => (
                            <AssetCard
                                key={idx}

                                title={section.name}
                                count={summaryCounts[section.id] || 0}
                                variant={COLORS[idx % COLORS.length] as "blue" | "green" | "orange" | "purple" | "red"}
                                Icon={section.icon}
                                size="sm"
                                onClick={() => setActiveSection(section.id)}

                            />
                        ))}
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
        </div>
    );
}
