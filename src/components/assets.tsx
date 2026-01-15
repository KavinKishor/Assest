"use client";

import { Monitor, Laptop, Smartphone, Tablet, Watch, Server, Printer, Wifi, Keyboard, Mouse, Tv, Fingerprint, Cctv, Headset, PcCase, Cpu, MonitorCog, Globe, MonitorStop } from "lucide-react";
import clsx from "clsx";

type Variant = "blue" | "green" | "orange" | "purple" | "red";
type CardSize = "sm" | "md" | "lg";

export interface AssetCardProps {
    title: string;
    count: number | string;
    variant?: Variant;
    Icon?: any;
    size?: CardSize;
    loading?: boolean;
    onClick?: () => void;
}

const sizeStyles: Record<CardSize, {
    container: string;
    icon: number;
    count: string;
    title: string;
}> = {
    sm: {
        container: "w-[140px]",
        icon: 90,
        count: "text-3xl",
        title: "text-xs",
    },
    md: {
        container: "w-[180px]",
        icon: 120,
        count: "text-4xl",
        title: "text-sm",
    },
    lg: {
        container: "w-[220px]",
        icon: 150,
        count: "text-5xl",
        title: "text-base",
    },
};
const variantStyles: Record<Variant, string> = {
    blue: "from-blue-500/20 to-blue-600/10 text-blue-600",
    green: "from-green-500/20 to-green-600/10 text-green-600",
    orange: "from-orange-500/20 to-orange-600/10 text-orange-600",
    purple: "from-purple-500/20 to-purple-600/10 text-purple-600",
    red: "from-red-500/20 to-red-600/10 text-red-600",
};

export function AssetCard({
    title,
    count,
    variant = "blue",
    Icon = Monitor,
    loading = false,
    size = "sm",
    onClick,
}: AssetCardProps) {
    if (loading) {
        return (
            <div className={clsx("aspect-square rounded-xl border bg-gray-100 dark:bg-gray-800 animate-pulse p-5", sizeStyles[size].container)}>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={clsx(
                "relative aspect-square rounded-xl border overflow-hidden",
                sizeStyles[size].container,
                "bg-white dark:bg-gray-900 group",
                "transition-all duration-300 ease-out",
                "hover:scale-[1.03] hover:shadow-xl",
                onClick && "cursor-pointer"
            )}
        >
            {/* Gradient Overlay */}
            <div
                className={clsx(
                    "absolute inset-0 bg-gradient-to-br opacity-40",
                    variantStyles[variant]
                )}
            />

            {/* Background Icon */}
            {Icon && (
                <Icon
                    size={sizeStyles[size].icon}
                    strokeWidth={1}
                    className={clsx(
                        "absolute left-[-30px] top-1/2 -translate-y-1/2",
                        "opacity-20 dark:opacity-30",
                        "transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12",
                        variantStyles[variant]
                    )}
                />
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-end pr-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
                    Count
                </span>
                <span className={clsx(
                    "font-semibold text-gray-700 dark:text-gray-300 capitalize",
                    sizeStyles[size].title
                )}>
                    {title}
                </span>
                <span className={clsx(
                    "mt-1 font-black text-gray-900 dark:text-white drop-shadow-sm",
                    sizeStyles[size].count
                )}>
                    {count}
                </span>
            </div>
        </div>
    );
}

const defaultAssets: AssetCardProps[] = [
    { title: "CPU", count: 56, variant: "blue", Icon: PcCase },
    { title: "PROCESSOR", count: 24, variant: "purple", Icon: Cpu },
    { title: "OS", count: 42, variant: "orange", Icon: MonitorCog },
    { title: "IP Address", count: 15, variant: "red", Icon: Globe },
    { title: "Monitor 1", count: 128, variant: "green", Icon: Monitor },
    { title: "Monitor 2", count: 128, variant: "green", Icon: MonitorStop },
    { title: "Keyboards", count: 45, variant: "purple", Icon: Keyboard },
    { title: "Mouse", count: 48, variant: "red", Icon: Mouse },
    { title: "VOIP", count: 62, variant: "blue", Icon: Headset },

    { title: "Servers", count: 8, variant: "blue", Icon: Server },
    { title: "Printers", count: 12, variant: "green", Icon: Printer },
    { title: "Routers", count: 6, variant: "orange", Icon: Wifi },


    { title: "Monitors", count: 62, variant: "blue", Icon: Tv },
    { title: "Fingerprints", count: 62, variant: "blue", Icon: Fingerprint },
    { title: "CCTV", count: 62, variant: "blue", Icon: Cctv },

];

export default function Assets({ assets = defaultAssets }: { assets?: AssetCardProps[] }) {
    return (
        <div className="flex flex-wrap gap-2 p-4 justify-center md:justify-start">
            {assets.map((asset, index) => (
                <AssetCard size="sm" key={index} {...asset} />
            ))}
        </div>
    );
}
