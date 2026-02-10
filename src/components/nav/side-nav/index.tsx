"use client";

import { ArrowLeftToLine, ArrowRightToLine, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Navigation from "./components/navigation";
import { Logo } from "@/components/logo";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={cn(
          "fixed left-0 top-12 z-50 rounded-r-xl bg-blue-600 px-2 py-2 text-white shadow-xl hover:bg-blue-700 tablet:hidden transition-all duration-300",
          isOpen ? "translate-x-48" : "translate-x-0",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ArrowLeftToLine size={18} />
        ) : (
          <ArrowRightToLine size={18} />
        )}
      </button>
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-40 flex h-[100dvh] w-56 shrink-0 flex-col border-r border-border bg-white dark:bg-black tablet:sticky tablet:translate-x-0 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Logo />
        </div>

        <div className="flex-1 flex flex-col justify-between py-6">
          <div className="space-y-1">
            <div className="px-6 mb-4">
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px]">Main Menu</span>
            </div>
            <Navigation />
          </div>

          <div className="px-6 pt-6 border-t border-border mt-auto space-y-4">
            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                <Settings size={18} />
                Settings
              </button>
              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                <HelpCircle size={18} />
                Help Center
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
