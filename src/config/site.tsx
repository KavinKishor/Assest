import { Gauge, type LucideIcon, MessagesSquare, Monitor } from "lucide-react";

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
    name: "Assets",
    href: "/assets",
  },
  {
    icon: MessagesSquare,
    name: "Ticket",
    href: "/ticket",
  },
];
