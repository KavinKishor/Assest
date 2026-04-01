"use client";

import { usePathname } from "next/navigation";
import { SideNav } from "@/components/nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/firstAuth";


    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <SideNav />
            <div className="flex-grow overflow-auto h-full bg-gray-50 dark:bg-background">{children}</div>
        </div>
    );

}
