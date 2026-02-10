"use client";

import { usePathname } from "next/navigation";
import { SideNav } from "@/components/nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/firstAuth";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-[100dvh]">
            <SideNav />
            <div className="flex-grow overflow-auto">{children}</div>
        </div>
    );
}
