"use client";

import { useEffect, useState } from "react";
import {
    Ticket as TicketIcon,
    Clock,
    CheckCircle2,
    AlertCircle,
    Activity,
    Plus,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface Ticket {
    _id: string;
    ticketId: string;
    description: string;
    currentStatus: string;
    createdAt: string;
    issue: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
}

export default function EmployeeDashboard({ user }: { user: { name: string, role: string } }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch("/api/tickets");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        // Sort by newest first
                        const sorted = data.sort((a: Ticket, b: Ticket) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        );
                        setTickets(sorted);
                    }
                }
            } catch {
                // silent error
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();

        // Listen for refresh events (from creating a ticket elsewhere if aligned)
        const handleRefresh = () => fetchTickets();
        window.addEventListener("refresh-data", handleRefresh);
        return () => window.removeEventListener("refresh-data", handleRefresh);
    }, []);

    // Calculate Stats
    const totalTickets = tickets.length;
    const pendingTickets = tickets.filter(t => ["Open", "In Progress"].includes(t.currentStatus)).length;
    const resolvedTickets = tickets.filter(t => ["Resolved", "Closed"].includes(t.currentStatus)).length;
    const recentTickets = tickets.slice(0, 5); // Limit to 5 most recent

    const stats = [
        {
            label: "Total Tickets",
            value: totalTickets,
            icon: TicketIcon,
            color: "text-blue-600 dark:text-white",
            bg: "bg-blue-100 dark:bg-blue-900/20",
            desc: "Lifetime requests"
        },
        {
            label: "Pending",
            value: pendingTickets,
            icon: Clock,
            color: "text-amber-600 dark:text-white",
            bg: "bg-amber-100 dark:bg-amber-900/20",
            desc: "In progress / Open"
        },
        {
            label: "Resolved",
            value: resolvedTickets,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-white",
            bg: "bg-emerald-100 dark:bg-emerald-900/20",
            desc: "Successfully closed"
        }
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Open": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "In Progress": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "Resolved": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Closed": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
            case "Unsolved": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background p-4 md:p-8 space-y-5">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    {/* <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
                        Hello, {user.name.split(' ')[0]}
                    </h1> */}
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2
               bg-gradient-to-r from-cyan-400 to-blue-500
               bg-clip-text text-transparent
               drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]">
                        Hello, {user.name.split(' ')[0]}
                    </h1>
                    <p className="text-lg text-gray-500 font-medium">Here&apos;s what&apos;s happening with your requests today.</p>
                </div>
                <Link href="/ticket" className="group flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                    <Plus size={20} />
                    <span>New Request</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-card p-4 rounded-[1rem] border dark:border-gray-800 shadow-xl relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 ${stat.color}`}>
                            <stat.icon size={100} />
                        </div>
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl w-fit mb-6`}>
                            <stat.icon size={28} />
                        </div>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">{loading ? "-" : stat.value}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Recent History */}
            <div className="bg-white dark:bg-card rounded-[1.5rem] border dark:border-gray-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                            <Activity size={20} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Recent Activity</h2>
                    </div>
                    <Link href="/ticket" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="p-2 md:p-4">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400 text-sm">Loading your history...</div>
                    ) : recentTickets.length > 0 ? (
                        <div className="space-y-2">
                            {recentTickets.map((ticket) => (
                                <div key={ticket._id} className="group flex flex-col md:flex-row items-center justify-between gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-3xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 text-xs">
                                            {ticket.ticketId.split('-')[1]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{ticket.issue}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{ticket.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <span className="text-xs font-bold text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        <span className={clsx("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider min-w-[100px] text-center", getStatusStyle(ticket.currentStatus))}>
                                            {ticket.currentStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 flex flex-col items-center justify-center text-center gap-4">
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full">
                                <AlertCircle size={32} className="text-gray-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No tickets yet</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto">Create your first ticket to track your support requests here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
