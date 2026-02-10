"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../container";
import { ThemeToggle } from "../theme-toggle";
import Image from "next/image";
import { ChevronDown, Bell, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { toast } from "react-hot-toast";

export default function TopNav({ title }: { title: string }) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; userId: string; role: string } | null>(null);
  const [notifications, setNotifications] = useState<Record<string, unknown>[]>([]);
  const filteredNotifications = notifications.filter(n => {
    if (user?.role === "employee") {
      return !String(n.type).startsWith("Asset");
    }
    return true;
  });
  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        // Check if there are new notifications by comparing lengths or IDs
        // For simplicity, using length check combined with a simplistic "different data" check
        // Ideally we'd compare the latest ID.
        setNotifications(data);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // silent
      }
    };
    fetchUser();
    fetchNotifications();

    // SSE implementation
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);

      setNotifications((prev) => {
        // Prevent duplicates
        if (prev.some(n => n._id === newNotification._id)) return prev;

        // Dispatch event to refresh other components (like Tickets table)
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("refresh-data"));
        }

        return [newNotification, ...prev];
      });

      // Visual feedback - Only show toast if user is allowed to see this type
      const isAsset = String(newNotification.type).startsWith("Asset");
      const isEmployee = user?.role === "employee";

      if (!(isEmployee && isAsset)) {
        toast.success(`New Notification: ${newNotification.title}`, {
          icon: '🔔',
          style: {
            borderRadius: '16px',
            background: '#1e293b',
            color: '#fff',
          },
        });
      }
    };

    eventSource.onerror = (err) => {
      // eslint-disable-next-line no-console
      console.error("SSE Error:", err);
      // EventSource automatically tries to reconnect, but we might want to log it
    };

    return () => {
      eventSource.close();
    };
  }, [router, user?.role]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      }
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border bg-white/80 dark:bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold uppercase tracking-tight 
                 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 pr-4 border-r border-border">
            {/* <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Search size={20} />
            </button> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-6 bg-red-800 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-black font-bold scale-75">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 mt-2 border-white shadow-2xl bg-white/95 dark:bg-card/95 backdrop-blur-xl max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-800">
                  <DropdownMenuLabel className="p-2">Notifications</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <button
                      onClick={async () => {
                        await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ all: true }) });
                        fetchNotifications();
                      }}
                      className="text-[10px] font-bold text-blue-500 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">No new notifications</div>
                ) : (
                  filteredNotifications.map((n) => (
                    <DropdownMenuItem
                      key={n._id as string}
                      className={clsx("cursor-pointer flex flex-col items-start gap-1 p-4 border-b dark:border-gray-800 last:border-none hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all outline-none", !n.isRead && "bg-blue-50/50 dark:bg-blue-900/10")}
                      onSelect={async () => {
                        // Mark as read in background to not block navigation
                        if (!n.isRead) {
                          fetch("/api/notifications", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: n._id })
                          }).then(() => fetchNotifications());
                        }

                        // Immediate navigation
                        if (n.link && typeof n.link === 'string') {
                          router.push(n.link);
                        }
                      }}
                    >
                      <div className="flex justify-between w-full items-start gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-tight truncate">{n.title as React.ReactNode}</span>
                            {String(n.type).startsWith("Asset") ? (
                              <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase rounded-md tracking-widest border border-indigo-200 dark:border-indigo-800/50">Asset</span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase rounded-md tracking-widest border border-blue-200 dark:border-blue-800/50">Support</span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{n.message as React.ReactNode}</p>
                        </div>
                        {!n.isRead && <span className="w-2 h-2 shrink-0 bg-blue-500 rounded-full mt-1 animate-pulse shadow-[0_0_8px_#3B82F6]"></span>}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">{new Date(n.createdAt as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer group">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                      {user?.name || "Agent Admin"}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      {user?.role || "Super User"}
                    </span>
                  </div>
                  <div className="relative">
                    <Image
                      src="/user.png"
                      alt="User"
                      className="rounded-full border-2 border-transparent group-hover:border-white transition-all shadow-sm"
                      width={40}
                      height={40}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=0D8ABC&color=fff`;
                      }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors " />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2  border-red-200 shadow-xl bg-white/95 dark:bg-card/95 backdrop-blur-xl">
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <User size={16} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Settings size={16} /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Container>
    </div>
  );
}
