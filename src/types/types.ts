import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type TicketMetric = {
  date: string;
  type: "created" | "resolved";
  count: number;
};

export interface Ticket {
  _id?: unknown;
  ticketId: string;
  currentStatus: string;
  priority: string;
  createdAt: string | Date;
  issue: string;
  description: string;
  createdBy?: string;
}

export interface AssetRequest {
  _id?: unknown;
  reqId: string;
  type: string;
  category: string;
  section: string;
  status: string;
  creator: {
    name: string;
    email?: string;
    role: string;
  };
  managerComment?: string;
  assetData: Record<string, unknown>;
}
