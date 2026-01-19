"use client";

import Container from "../container";
import { ThemeToggle } from "../theme-toggle";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { ChevronDown, Bell, Search } from "lucide-react";

export default function TopNav({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-border bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* <Logo className="md:flex hidden" /> */}
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-2 pr-4 border-r border-border">
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-950"></span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* User Profile moved here */}
            <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer group">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">Agent Admin</span>
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Super User</span>
              </div>
              <div className="relative">
                <Image
                  src="/avatar.png"
                  alt="User"
                  className="rounded-xl border-2 border-transparent group-hover:border-blue-500 transition-all shadow-sm"
                  width={40}
                  height={40}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ui-avatars.com/api/?name=Agent+Admin&background=0D8ABC&color=fff";
                  }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></div>
              </div>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
