import { Gauge, type LucideIcon, MessagesSquare, Monitor, Building2 } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
    icon: LucideIcon;
    name: string;
    href: string;
};

export const siteConfig = {
    title: "Abc Dashboard",
    description: "The Dashboard",
};

export const navigations: Navigation[] = [
    {
        icon: Gauge,
        name: "Dashboard",
        href: "/",
    },
    {
        icon: Monitor,
        name: "IT Assets",
        href: "/assets",
    },
    {
        icon: Building2,
        name: "Office Assets",
        href: "/office-assets",
    },
    {
        icon: MessagesSquare,
        name: "Ticket",
        href: "/ticket",
    },
];
