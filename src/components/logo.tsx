import { VisActorLogo } from "@/components/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" className={cn("flex items-center gap-2 group transition-all", className)}>
            <div className="p-1.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <VisActorLogo size={24} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-gray-950 dark:text-white leading-none">
                    VIS<span className="text-blue-600">ACTOR</span>
                </span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[2px] mt-0.5">Assets Platform</span>
            </div>
        </Link>
    );
}
