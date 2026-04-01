"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    Ticket as TicketIcon,
    Plus,
    X,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    Tag,
    Shield,
    FileText,
    History,
    Cpu,
    Monitor,
    Keyboard as KeyboardIcon,
    MousePointer2,
    Truck,
    MapPin,
    HardDrive,
    MessageSquare,
    Download
} from "lucide-react";
import * as XLSX from "xlsx";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useLoading } from "@/hooks/use-loading";

interface Ticket {
    _id: string;
    ticketId: string;
    assetId: string;
    assetName: string;
    issue: "Software" | "Hardware";
    tool?: string;
    description: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    currentStatus: "Open" | "In Progress" | "Resolved" | "Closed" | "Unsolved";
    reportingManager?: string;
    approvalStatus: "Pending" | "Approved" | "Rejected" | "Not Required";
    approvalManager?: string;
    officeLocation: string;
    cabinId: string;
    floor: string;
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    createdBy: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface Tracking {
    _id: string;
    action: string;
    description: string;
    comment?: string;
    performedBy: {
        name: string;
        role: string;
    };
    createdAt: string;
}

interface AssetRequest {
    _id: string;
    reqId: string;
    type: "CREATE" | "UPDATE" | "DELETE";
    category: "IT_Assets" | "Office_Assets";
    section: string;
    assetData: Record<string, unknown>;
    creator: {
        userId: string;
        name: string;
        email?: string;
        role: string;
    };
    status: "Pending" | "Approved" | "Rejected";
    managerComment?: string;
    createdAt: string;
}

export default function Tickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<AssetRequest | null>(null);
    const [trackingHistory, setTrackingHistory] = useState<Tracking[]>([]);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ id: string, name: string, role: string } | null>(null);
    const [itAssociates, setItAssociates] = useState<{ _id: string, name: string, role: string, isVerified?: boolean }[]>([]);
    const [updateComment, setUpdateComment] = useState("");
    const [managerComment, setManagerComment] = useState("");
    const [pendingAssignee, setPendingAssignee] = useState("");
    const [viewMode, setViewMode] = useState<"tickets" | "assets">("tickets");
    const searchParams = useSearchParams();
    const { withLoading } = useLoading();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "assets") {
            setViewMode("assets");
        } else if (tab === "tickets") {
            setViewMode("tickets");
        }
    }, [searchParams]);

    // Form State
    const [formData, setFormData] = useState({
        assetId: "",
        assetName: "",
        issue: "Software" as "Software" | "Hardware",
        tool: "",
        description: "",
        priority: "Medium" as "Low" | "Medium" | "High" | "Urgent",
        officeLocation: "Acidus HO",
        cabinId: "",
        floor: ""
    });

    const fetchTickets = async () => {
        setLoading(true);
        await withLoading(async () => {
            try {
                const res = await fetch("/api/tickets");
                const data = await res.json();

                if (!Array.isArray(data)) {
                    throw new Error(data.error || "Failed to fetch tickets");
                }

                // Sort by updatedAt descending (newest activity first)
                const sorted = data.sort((a: Ticket, b: Ticket) => {
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                });
                setTickets(sorted);
            } catch {
                // console.error("Fetch error:", error);
                toast.error("Failed to load tickets");
            } finally {
                setLoading(false);
            }
        });
    };

    const fetchTicketDetails = async (id: string) => {
        await withLoading(async () => {
            try {
                const res = await fetch(`/api/tickets/${id}`);
                const data = await res.json();
                setSelectedTicket(data.ticket);
                setTrackingHistory(data.tracking);
                setPendingAssignee(data.ticket.assignedTo?._id || "");

                // Re-fetch IT associates to ensure list is fresh when modal opens
                fetchITAssociates();

                setIsDetailsModalOpen(true);
            } catch {
                toast.error("Failed to load ticket details");
            }
        });
    };

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setCurrentUser({ id: data.user.id, name: data.user.name, role: data.user.role });
            }
        } catch {
            // silent
        }
    };

    const fetchITAssociates = async () => {
        try {
            const res = await fetch("/api/users/it-associates");
            if (res.ok) {
                const data = await res.json();
                setItAssociates(data);
            }
        } catch {
            toast.error("Network error: Could not load IT staff list");
        }
    };


    const fetchAssetRequests = async () => {
        setLoading(true);
        await withLoading(async () => {
            try {
                const res = await fetch("/api/asset-requests");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAssetRequests(data);
                }
            } catch {
                toast.error("Failed to load asset requests");
            } finally {
                setLoading(false);
            }
        });
    };

    const handleAssetAction = async (id: string, status: "Approved" | "Rejected") => {
        if (!managerComment.trim()) {
            toast.error("Please add a comment for this decision");
            return;
        }
        await withLoading(async () => {
            try {
                const res = await fetch(`/api/asset-requests/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status, managerComment }),
                });
                if (res.ok) {
                    toast.success(`Request ${status} Successfully!`);
                    setManagerComment("");
                    setIsRequestModalOpen(false);
                    fetchAssetRequests();
                } else {
                    toast.error("Failed to process request");
                }
            } catch {
                toast.error("Network error");
            }
        });
    };

    useEffect(() => {
        fetchTickets();
        fetchUser();
        fetchITAssociates();

        const handleRefresh = () => {
            fetchTickets();
            fetchAssetRequests();
            fetchITAssociates();
        };

        window.addEventListener("refresh-data", handleRefresh);
        return () => window.removeEventListener("refresh-data", handleRefresh);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (viewMode === "assets") {
            fetchAssetRequests();
        } else {
            fetchTickets();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        await withLoading(async () => {
            try {
                const res = await fetch("/api/tickets", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    toast.success("Ticket Created Successfully!");
                    setIsCreateModalOpen(false);
                    setFormData({
                        assetId: "",
                        assetName: "",
                        issue: "Software",
                        tool: "",
                        description: "",
                        priority: "Medium",
                        officeLocation: "Acidus HO",
                        cabinId: "",
                        floor: ""
                    });
                    fetchTickets();
                } else {
                    const error = await res.json();
                    toast.error(error.error || "Failed to create ticket");
                }
            } catch {
                toast.error("Network error");
            }
        });
    };

    const handleUpdateTicket = async (id: string, updates: Record<string, unknown>) => {
        if (!updateComment.trim()) {
            toast.error("Please add a comment for this update");
            return;
        }
        await withLoading(async () => {
            try {
                const res = await fetch(`/api/tickets/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...updates, comment: updateComment }),
                });
                if (res.ok) {
                    toast.success("Ticket Updated Successfully!");
                    setUpdateComment(""); // Clear comment after success
                    fetchTicketDetails(id);
                    fetchTickets();
                } else {
                    toast.error("Failed to update ticket");
                }
            } catch {
                toast.error("Network error");
            }
        });
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Open": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "In Progress": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "Resolved": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Closed": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
            case "Unsolved": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case "Urgent": return "text-rose-600 bg-rose-50 dark:bg-rose-900/20";
            case "High": return "text-orange-600 bg-orange-50 dark:bg-orange-900/20";
            case "Medium": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
            case "Low": return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    const handleDownload = () => {
        const dataToExport = viewMode === "tickets" ? tickets : assetRequests;
        if (!dataToExport || dataToExport.length === 0) {
            toast.error("No data available to download");
            return;
        }

        let flattenedData = [];

        if (viewMode === "tickets") {
            flattenedData = (dataToExport as Ticket[]).map(ticket => ({
                "Ticket ID": ticket.ticketId,
                "Asset ID": ticket.assetId,
                "Asset Name": ticket.assetName,
                "Issue Category": ticket.issue,
                "Tool/Software": ticket.tool || "N/A",
                "Description": ticket.description,
                "Priority": ticket.priority,
                "Status": ticket.currentStatus,
                "Office Location": ticket.officeLocation,
                "Floor": ticket.floor,
                "Cabin ID": ticket.cabinId,
                "Approval Status": ticket.approvalStatus,
                "Assigned To": ticket.assignedTo?.name || "Unassigned",
                "Created By": ticket.createdBy?.name || "Unknown",
                "Created At": formatDate(ticket.createdAt),
                "Last Updated": formatDate(ticket.updatedAt)
            }));
        } else {
            flattenedData = (dataToExport as AssetRequest[]).map(request => {
                const baseData = {
                    "Request ID": request.reqId,
                    "Type": request.type,
                    "Category": request.category.replace("_", " "),
                    "Section": request.section,
                    "Creator": request.creator.name,
                    "Status": request.status,
                    "Manager Comment": request.managerComment || "N/A",
                    "Created At": formatDate(request.createdAt)
                };

                // Flatten assetData keys into the same object
                const assetDetails: Record<string, unknown> = {};
                if (request.assetData && typeof request.assetData === 'object') {
                    Object.entries(request.assetData).forEach(([key, value]) => {
                        if (!['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) {
                            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            assetDetails[formattedKey] = typeof value === 'object' ? JSON.stringify(value) : value;
                        }
                    });
                }

                return { ...baseData, ...assetDetails };
            });
        }

        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, viewMode === "tickets" ? "Support Tickets" : "Asset Requests");

        // Generating filename with timestamp
        const fileName = `${viewMode === "tickets" ? "Tickets_Report" : "Asset_Requests_Report"}_${new Date().toISOString().split('T')[0]}.xlsx`;

        XLSX.writeFile(workbook, fileName);
        toast.success("Excel file downloaded successfully!");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Toggle State
    // const [viewMode, setViewMode] = useState<"tickets" | "assets">("tickets"); // MOVED UP

    // Determine the single newest ticket based on createdAt
    const newestTicketId = tickets.length > 0
        ? [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]._id
        : null;

    // Asset Request Stats
    const assetStats = {
        total: assetRequests.length,
        pending: assetRequests.filter(r => r.status === "Pending").length,
        approved: assetRequests.filter(r => r.status === "Approved").length,
        rejected: assetRequests.filter(r => r.status === "Rejected").length,
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-background">
            {/* Sticky Sub-Header for Toggles */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b dark:border-gray-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => withLoading(async () => { setViewMode("tickets"); })}
                            className={clsx(
                                "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                                viewMode === "tickets"
                                    ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            <TicketIcon size={16} /> Support Tickets
                        </button>
                        {currentUser?.role !== "employee" && (
                            <button
                                onClick={() => withLoading(async () => { setViewMode("assets"); })}
                                className={clsx(
                                    "flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                                    viewMode === "assets"
                                        ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                            >
                                <Shield size={16} /> Asset Requests
                            </button>
                        )}
                    </div>

                    {/* Only show Create Ticket button if on Tickets view */}
                    {viewMode === "tickets" && currentUser?.role !== "Manager" && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95"
                        >
                            <Plus size={20} />
                            Create Ticket
                        </button>
                    )}

                    <button
                        onClick={handleDownload}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                    >
                        <Download size={20} />
                        Download Report
                    </button>
                </div>
            </div>

            {viewMode === "assets" ? (
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Total Requests", value: assetStats.total, icon: Shield, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/10" },
                                { label: "Pending Approval", value: assetStats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/10" },
                                { label: "Approved", value: assetStats.approved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
                                { label: "Rejected", value: assetStats.rejected, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/10" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-card p-5 rounded-3xl border dark:border-gray-800 shadow-sm flex items-center gap-4 transition-all hover:scale-105">
                                    <div className={clsx("p-3 rounded-2xl", stat.bg)}>
                                        <stat.icon size={20} className={stat.color} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 bg-white dark:bg-card p-6 rounded-3xl border dark:border-gray-800 shadow-sm">
                            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-500/20">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Asset Requests</h1>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Review and manage asset modification requests</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-card rounded-[2rem] border-2 dark:border-gray-800 shadow-xl shadow-black/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-white/5 border-b dark:border-gray-800">
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center">REQ ID</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">TYPE</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">CATEGORY</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">CREATOR</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center">STATUS</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-800">
                                        {loading ? (
                                            [1, 2, 3].map(i => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan={6} className="px-6 py-4"><div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full"></div></td>
                                                </tr>
                                            ))
                                        ) : assetRequests.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-20 text-center opacity-40">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Shield size={48} />
                                                        <p className="font-bold text-lg">No Asset Requests Found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : assetRequests.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <td className="px-6 py-5 text-center">
                                                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">{request.reqId}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                        request.type === "CREATE" ? "bg-emerald-100 text-emerald-700" :
                                                            request.type === "UPDATE" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700")}>
                                                        {request.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900 dark:text-white text-sm">{request.section}</span>
                                                        <span className="text-[10px] font-medium text-gray-500 uppercase">{request.category.replace("_", " ")}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{request.creator.name}</span>
                                                        <span className="text-[10px] text-gray-500">{request.creator.role}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                        request.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                                            request.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            setIsRequestModalOpen(true);
                                                        }}
                                                        className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 rounded-xl transition-all hover:scale-110"
                                                    >
                                                        <ArrowUpRight size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="flex items-center gap-4 bg-white dark:bg-card p-6 rounded-3xl border dark:border-gray-800 shadow-sm">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
                                <TicketIcon size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Support Tickets</h1>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Manage and track IT support requests</p>
                            </div>
                        </div>


                        {/* Content Area - Table */}
                        <div className="bg-white dark:bg-card rounded-[2rem] border-2 dark:border-gray-800 shadow-2xl shadow-black/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-white/5 border-b dark:border-gray-800">
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Ticket ID</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Asset Detail</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Issue Type</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Priority</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Status</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Created By</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Last Updated</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-800">
                                        {loading ? (
                                            [1, 2, 3].map(i => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan={8} className="px-6 py-4"><div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full"></div></td>
                                                </tr>
                                            ))
                                        ) : tickets.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-20 text-center opacity-40">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <AlertCircle size={48} />
                                                        <p className="font-bold text-lg">No Tickets Found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : tickets.map((ticket) => {
                                            // Only show NEW for the single newest ticket based on createdAt AND if created within last 1 hour
                                            const isNew = ticket._id === newestTicketId && (Date.now() - new Date(ticket.createdAt).getTime()) < 60 * 60 * 1000;
                                            const isUpdated = ticket.updatedAt !== ticket.createdAt;
                                            const isRecentlyUpdated = isUpdated && (Date.now() - new Date(ticket.updatedAt).getTime()) < 24 * 60 * 60 * 1000;

                                            return (
                                                <tr key={ticket._id} className={clsx(
                                                    "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group",
                                                    // isRecentlyUpdated && "bg-gray-50 dark:bg-white/5"
                                                )}>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-blue-600 dark:text-blue-400 text-sm">{ticket.ticketId}</span>
                                                            {isNew && (
                                                                <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded shadow-sm shadow-rose-500/20 animate-pulse">
                                                                    NEW
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900 dark:text-white text-sm">{ticket.assetName}</span>
                                                            <span className="text-[10px] font-medium text-gray-500 uppercase">{ticket.assetId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                            {ticket.issue === "Software" ? <Shield size={14} className="text-blue-500" /> : <Tag size={14} className="text-orange-500" />}
                                                            {ticket.issue}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", getPriorityStyles(ticket.priority))}>
                                                            {ticket.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={clsx("w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", getStatusStyles(ticket.currentStatus))}>
                                                                {ticket.currentStatus}
                                                            </span>
                                                            {isRecentlyUpdated && (
                                                                <span className="text-[9px] font-bold text-blue-500 flex items-center gap-1">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                                    Updated
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 text-xs font-bold capitalize">
                                                                {ticket.createdBy.name.charAt(0)}
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{ticket.createdBy.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-gray-900 dark:text-white">{formatDate(ticket.updatedAt)}</span>
                                                            <span className="text-[10px] text-gray-400">Created: {formatDate(ticket.createdAt)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <button
                                                            onClick={() => fetchTicketDetails(ticket._id)}
                                                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl transition-all hover:scale-110"
                                                        >
                                                            <ArrowUpRight size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Create Ticket Modal */}
                        {isCreateModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4  animate-in fade-in duration-300 ">
                                <div className="bg-white dark:bg-card w-full max-w-5xl rounded-[2.5rem] border dark:border-gray-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 h-[calc(100vh-5rem)]  flex flex-col">
                                    <div className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-blue-900/10 shrink-0">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-600 text-white rounded-xl">
                                                <Plus size={20} />
                                            </div>
                                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">New Support Ticket</h2>
                                        </div>
                                        <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    {/* <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-8 space-y-6 "> */}
                                    <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">

                                        <div className="grid grid-cols-2 gap-6 ">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                    Asset ID <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    required
                                                    value={formData.assetId}
                                                    onChange={e => setFormData({ ...formData, assetId: e.target.value })}
                                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all"
                                                    placeholder="e.g. LAP-102"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                    Asset Name <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    required
                                                    value={formData.assetName}
                                                    onChange={e => setFormData({ ...formData, assetName: e.target.value })}
                                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all"
                                                    placeholder="e.g. MacBook Pro"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                    Issue Category <span className="text-rose-500">*</span>
                                                </label>
                                                <select
                                                    value={formData.issue}
                                                    onChange={e => setFormData({ ...formData, issue: e.target.value as "Software" | "Hardware" })}
                                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all appearance-none"
                                                >
                                                    <option value="Software">Software</option>
                                                    <option value="Hardware">Hardware</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                    Priority <span className="text-rose-500">*</span>
                                                </label>
                                                <select
                                                    value={formData.priority}
                                                    onChange={e => setFormData({ ...formData, priority: e.target.value as "Low" | "Medium" | "High" | "Urgent" })}
                                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all appearance-none"
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                    <option value="Urgent">Urgent</option>
                                                </select>
                                            </div>
                                        </div>

                                        {formData.issue === "Software" && (
                                            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                    Software/Tool Name <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    required={formData.issue === "Software"}
                                                    value={formData.tool}
                                                    onChange={e => setFormData({ ...formData, tool: e.target.value })}
                                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all"
                                                    placeholder="e.g. Adobe Photoshop, Windows Update"
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                Description <span className="text-rose-500">*</span>
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all resize-none"
                                                placeholder="Describe the issue in detail..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                    Office Location <span className="text-rose-500">*</span>
                                                </label>
                                                <select
                                                    required
                                                    value={formData.officeLocation}
                                                    onChange={e => setFormData({ ...formData, officeLocation: e.target.value })}
                                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all appearance-none"
                                                >
                                                    <option value="Acidus HO">Acidus HO</option>
                                                    <option value="Acidus Tidel">Acidus Tidel</option>
                                                    <option value="Acidus JP">Acidus JP</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                    Floor <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    required
                                                    value={formData.floor}
                                                    onChange={e => setFormData({ ...formData, floor: e.target.value })}
                                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all"
                                                    placeholder="e.g. 4th Floor"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                                    Cabin ID <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    required
                                                    value={formData.cabinId}
                                                    onChange={e => setFormData({ ...formData, cabinId: e.target.value })}
                                                    className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl text-sm font-bold focus:border-blue-500 outline-none transition-all"
                                                    placeholder="e.g. CAB-402"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t dark:border-gray-800 flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreateModalOpen(false)}
                                                className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl font-bold transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-[2] px-6 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 hover:-translate-y-1 active:scale-95"
                                            >
                                                Submit Ticket
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Ticket Details & Tracking Modal */}
                        {isDetailsModalOpen && selectedTicket && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-2  animate-in fade-in duration-300">
                                <div className="bg-white dark:bg-card w-full max-w-4xl rounded-[1rem] border dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border-blue-400">
                                    {/* Modal Header */}
                                    <div className="px-8 py-2 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-600 text-white rounded-xl">
                                                <TicketIcon size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{selectedTicket.ticketId}</h2>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={clsx("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", getStatusStyles(selectedTicket.currentStatus))}>
                                                        {selectedTicket.currentStatus}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400">Created on {formatDate(selectedTicket.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
                                        {/* Left Side: Details */}
                                        <div className="lg:col-span-3 space-y-8">
                                            <section>
                                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                                    <FileText size={14} className="text-blue-500" />
                                                    Ticket Information
                                                </h3>
                                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border dark:border-gray-800">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Asset</p>
                                                        <p className="font-bold text-gray-900 dark:text-white">{selectedTicket.assetName}</p>
                                                        <p className="text-[10px] text-blue-500 font-bold uppercase">{selectedTicket.assetId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Issue Type</p>
                                                        <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 capitalize">
                                                            {selectedTicket.issue === "Software" ? <Shield size={14} /> : <Tag size={14} />}
                                                            {selectedTicket.issue} {selectedTicket.tool && `(${selectedTicket.tool})`}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Description</p>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                                                            {selectedTicket.description}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                                                        <p className="font-bold text-gray-900 dark:text-white">{selectedTicket.officeLocation}</p>
                                                        <p className="text-sm font-medium text-gray-500">Floor: {selectedTicket.floor}</p>
                                                        <p className="text-xs font-bold text-blue-500">Cabin: {selectedTicket.cabinId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Created By</p>
                                                        <p className="font-bold text-gray-900 dark:text-white">{selectedTicket.createdBy.name}</p>
                                                        <p className="text-[10px] text-gray-500">{selectedTicket.createdBy.email}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] mb-4 flex items-center gap-2">
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                    Approvals & Assignments
                                                </h3>
                                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border dark:border-gray-800">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Approval Status</p>
                                                        <span className={clsx("text-xs font-black uppercase tracking-widest",
                                                            selectedTicket.approvalStatus === "Approved" ? "text-emerald-500" :
                                                                selectedTicket.approvalStatus === "Pending" ? "text-amber-500" : "text-rose-500")}>
                                                            {selectedTicket.approvalStatus}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Assigned IT Associate</p>
                                                        <p className="font-bold text-blue-600 dark:text-blue-400">{selectedTicket.assignedTo?.name || "Not Yet Assigned"}</p>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Right Side: Tracking Timeline */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                                                <History size={14} className="text-purple-500" />
                                                Tracking Progress
                                            </h3>
                                            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
                                                {trackingHistory.length === 0 ? (
                                                    <p className="text-xs text-center text-gray-500 py-10">No tracking logs available</p>
                                                ) : trackingHistory.map((log, idx) => (
                                                    <div key={log._id} className="relative pl-10 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                                        <div className={clsx(
                                                            "absolute left-0 top-1.5 w-8 h-8 rounded-xl flex items-center justify-center border-4 border-white dark:border-gray-900 z-10 shadow-sm transition-all duration-500",
                                                            idx === 0 ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                                                        )}>
                                                            {idx === 0 ? <Clock size={14} className="animate-pulse" /> : <CheckCircle2 size={14} />}
                                                        </div>
                                                        <div className={clsx("transition-opacity duration-500", idx > 0 && "opacity-70")}>
                                                            <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1 tracking-widest">{log.action}</p>
                                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{log.description}</p>
                                                            {log.comment && (
                                                                <div className="mt-2 p-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl relative">
                                                                    <div className="absolute -left-1.5 top-3 w-3 h-3 bg-blue-50/50 dark:bg-blue-900/20 border-l border-b border-blue-100 dark:border-blue-800/50 rotate-45"></div>
                                                                    <p className="text-xs italic text-blue-700 dark:text-blue-300 font-medium">&quot;{log.comment}&quot;</p>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                                                                    {log.performedBy.name} ({log.performedBy.role})
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">{formatDate(log.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer Controls */}
                                    <div className="p-6 border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                                <FileText size={12} className="text-blue-500" />
                                                Update Comment <span className="text-rose-500 font-black">*Required</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Add a reason or note for this status update..."
                                                value={updateComment}
                                                onChange={(e) => setUpdateComment(e.target.value)}
                                                className="w-full px-5 py-3 bg-white dark:bg-background border-2 dark:border-gray-800 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 transition-all shadow-inner"
                                            />
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                {(["Manager", "VP", "CEO", "IT_Admin"].includes(currentUser?.role || "")) && selectedTicket.approvalStatus === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                if (!pendingAssignee) {
                                                                    toast.error("Please assign an associate before approving");
                                                                    return;
                                                                }
                                                                handleUpdateTicket(selectedTicket._id, {
                                                                    approvalStatus: "Approved",
                                                                    assignedTo: pendingAssignee
                                                                });
                                                            }}
                                                            className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all hover:-translate-y-1"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateTicket(selectedTicket._id, { approvalStatus: "Rejected" })}
                                                            className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all hover:-translate-y-1"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {(["Manager", "VP", "CEO", "IT_Admin"].includes(currentUser?.role || "")) && (
                                                    <select
                                                        onChange={(e) => {
                                                            const newValue = e.target.value;
                                                            if (selectedTicket.approvalStatus === "Pending") {
                                                                setPendingAssignee(newValue);
                                                            } else {
                                                                handleUpdateTicket(selectedTicket._id, { assignedTo: newValue });
                                                            }
                                                        }}
                                                        value={selectedTicket.approvalStatus === "Pending" ? pendingAssignee : (selectedTicket.assignedTo?._id || "")}
                                                        className="px-4 py-2.5 bg-white dark:bg-background border-2 dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                                                    >
                                                        <option value="">Select IT Associate</option>
                                                        {itAssociates.map(it => (
                                                            <option key={it._id} value={it._id}>
                                                                {it.name} ({it.role}) {!it.isVerified && "[Unverified]"}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}

                                                {selectedTicket.approvalStatus === "Approved" && (currentUser?.id === String(selectedTicket.assignedTo?._id) || currentUser?.role === "IT_Admin" || currentUser?.role === "Manager" || currentUser?.role === "VP" || currentUser?.role === "CEO") && (
                                                    <select
                                                        onChange={(e) => handleUpdateTicket(selectedTicket._id, { currentStatus: e.target.value })}
                                                        value={selectedTicket.currentStatus}
                                                        className="px-4 py-2.5 bg-white dark:bg-background border-2 dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                                                    >
                                                        {/* Always show current status */}
                                                        <option value={selectedTicket.currentStatus}>{selectedTicket.currentStatus}</option>

                                                        {/* Show next allowed statuses */}
                                                        {selectedTicket.currentStatus === "Open" && (
                                                            <option value="In Progress">In Progress</option>
                                                        )}
                                                        {selectedTicket.currentStatus === "In Progress" && (
                                                            <>
                                                                <option value="Resolved">Resolved</option>
                                                                <option value="Unsolved">Unsolved</option>
                                                            </>
                                                        )}
                                                        {(selectedTicket.currentStatus === "Resolved" || selectedTicket.currentStatus === "Unsolved") && (
                                                            <option value="Closed">Closed</option>
                                                        )}
                                                    </select>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setIsDetailsModalOpen(false)}
                                                className="px-6 py-2 bg-white dark:bg-card border-2 dark:border-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-bold text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                Close View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* Asset Request Details Modal */}
            {isRequestModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-card w-full max-w-3xl rounded-[1rem] border-2 dark:border-blue-600 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 scale-100">
                        {/* Header */}
                        <div className="px-8 py-6 bg-blue-500 dark:bg-black dark:border-b-2 dark:border-blue-600 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight uppercase">Request Details</h3>
                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{selectedRequest.reqId}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsRequestModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto space-y-8 no-scrollbar flex-1 bg-gray-50/30 dark:bg-transparent">
                            {/* Visual Timeline/Steps */}
                            <div className="relative flex justify-between items-center px-4 mb-4">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0"></div>
                                {[
                                    { label: "Submitted", active: true, done: true, icon: FileText },
                                    { label: "Pending", active: selectedRequest.status === "Pending", done: selectedRequest.status !== "Pending", icon: Clock },
                                    { label: selectedRequest.status === "Rejected" ? "Rejected" : "Finalized", active: selectedRequest.status !== "Pending", done: selectedRequest.status !== "Pending", icon: selectedRequest.status === "Approved" ? CheckCircle2 : selectedRequest.status === "Rejected" ? AlertCircle : Shield }
                                ].map((step, idx) => (
                                    <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={clsx(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-card transition-all duration-500 shadow-sm",
                                            step.done ? "bg-emerald-500 text-white" : step.active ? "bg-blue-600 text-white animate-pulse" : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                                        )}>
                                            <step.icon size={18} />
                                        </div>
                                        <span className={clsx("text-[9px] font-black uppercase tracking-widest", step.active || step.done ? "text-gray-900 dark:text-white" : "text-gray-400")}>{step.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-5 bg-white dark:bg-gray-800/40 rounded-3xl border dark:border-gray-800 shadow-sm transition-all hover:scale-[1.02]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                            <Shield size={14} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request Type</span>
                                    </div>
                                    <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{selectedRequest.type}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-gray-800/40 rounded-3xl border dark:border-gray-800 shadow-sm transition-all hover:scale-[1.02]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                                            <Tag size={14} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Category</span>
                                    </div>
                                    <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate">{selectedRequest.section}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">{selectedRequest.category.replace("_", " ")}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-gray-800/40 rounded-3xl border dark:border-gray-800 shadow-sm transition-all hover:scale-[1.02]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={clsx("p-1.5 rounded-lg",
                                            selectedRequest.status === "Approved" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" :
                                                selectedRequest.status === "Pending" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                                        )}>
                                            <Clock size={14} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</span>
                                    </div>
                                    <p className={clsx("text-lg font-black uppercase tracking-tighter",
                                        selectedRequest.status === "Approved" ? "text-emerald-600" :
                                            selectedRequest.status === "Pending" ? "text-amber-600" : "text-rose-600")}>{selectedRequest.status}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Requested Data</span>
                                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Object.entries(selectedRequest.assetData).filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key)).map(([key, value]) => (
                                        <div key={key} className="p-4 bg-white dark:bg-gray-800/40 rounded-2xl border dark:border-gray-800 transition-all hover:border-indigo-500/30 group shadow-sm flex items-center gap-4">
                                            <div className="p-2.5 bg-gray-50 dark:bg-gray-900/50 text-gray-400 group-hover:text-indigo-500 rounded-xl transition-colors">
                                                {key.toLowerCase().includes('cpu') || key.toLowerCase().includes('processor') ? <Cpu size={16} /> :
                                                    key.toLowerCase().includes('monitor') ? <Monitor size={16} /> :
                                                        key.toLowerCase().includes('keyboard') ? <KeyboardIcon size={16} /> :
                                                            key.toLowerCase().includes('mouse') ? <MousePointer2 size={16} /> :
                                                                key.toLowerCase().includes('vendor') ? <Truck size={16} /> :
                                                                    key.toLowerCase().includes('location') ? <MapPin size={16} /> :
                                                                        <HardDrive size={16} />}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1 group-hover:text-indigo-400 transition-colors">
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </span>
                                                <p className="font-bold text-gray-900 dark:text-white truncate text-sm">
                                                    {typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedRequest.status === "Pending" && (currentUser?.role === "Manager" || currentUser?.role === "VP") && (
                                <div className="pt-4 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Decision Comment</label>
                                            <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">Required for Action</span>
                                        </div>
                                        <textarea
                                            placeholder="Provide a reason for approval or rejection to the employee..."
                                            value={managerComment}
                                            onChange={(e) => setManagerComment(e.target.value)}
                                            className="w-full px-6 py-5 bg-white dark:bg-gray-900 border-2 dark:border-gray-800 rounded-3xl text-sm font-medium outline-none focus:border-indigo-500 transition-all min-h-[120px] shadow-inner focus:ring-4 focus:ring-indigo-500/10 no-scrollbar"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleAssetAction(selectedRequest._id, "Approved")}
                                            className="group flex-1 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden relative"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            <CheckCircle2 size={20} className="relative z-10" />
                                            <span className="relative z-10 uppercase tracking-widest">Approve Request</span>
                                        </button>
                                        <button
                                            onClick={() => handleAssetAction(selectedRequest._id, "Rejected")}
                                            className="group flex-1 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-3xl font-black shadow-xl shadow-rose-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden relative"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            <AlertCircle size={20} className="relative z-10" />
                                            <span className="relative z-10 uppercase tracking-widest">Reject Request</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedRequest.managerComment && (
                                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-indigo-900/30 rounded-3xl relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare size={14} className="text-blue-500" />
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Manager Verdict</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mt-1 leading-relaxed">{selectedRequest.managerComment}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
