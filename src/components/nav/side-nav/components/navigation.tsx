"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigations } from "@/config/site";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-y-2 px-3">
      {navigations.map((navigation) => {
        const Icon = navigation.icon;
        const isActive = pathname === navigation.href || (pathname.startsWith(navigation.href) && navigation.href !== "/");

        return (
          <Link
            key={navigation.name}
            href={navigation.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 group",
              isActive
                ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-[1.02]"
                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-blue-900/10"
            )}
          >
            <Icon
              size={20}
              className={cn(
                "transition-colors",
                isActive ? "text-white" : "group-hover:text-blue-600"
              )}
            />
            <span className="text-sm tracking-tight leading-none">
              {navigation.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
