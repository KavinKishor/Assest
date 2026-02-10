"use client";

import { SmilePlus, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useAtomValue } from "jotai";
import { assetRequestsAtom } from "@/lib/atoms";
import ChartTitle from "../../components/chart-title";
import LinearProgress from "./components/linear-progress";

export default function CustomerSatisfication() {
  const assetRequests = useAtomValue(assetRequestsAtom);
  const total = assetRequests.length || 1;

  const accepted = assetRequests.filter(r => r.status === "Approved").length;
  const rejected = assetRequests.filter(r => r.status === "Rejected").length;
  const pending = assetRequests.filter(r => r.status === "Pending").length;

  const assetRequestOptions = [
    {
      label: "Accepted Request",
      color: "#5fb67a",
      percentage: Math.round((accepted / total) * 100),
      displayValue: `${Math.round((accepted / total) * 100)}%`,
      icon: <CheckCircle2 className="h-6 w-6" stroke="#5fb67a" />,
    },
    {
      label: "In Progress (Pending)",
      color: "#f5c36e",
      percentage: Math.round((pending / total) * 100),
      displayValue: pending.toString(),
      icon: <Clock className="h-6 w-6" stroke="#f5c36e" />,
    },
    {
      label: "Rejected Request",
      color: "#da6d67",
      percentage: Math.round((rejected / total) * 100),
      displayValue: rejected.toString(),
      icon: <XCircle className="h-6 w-6" stroke="#da6d67" />,
    },
  ];

  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Asset Request Overview" icon={SmilePlus} />
      <div className="my-4 flex h-full items-center justify-between">
        <div className="mx-auto grid w-full grid-cols-2 gap-6">
          <TotalAssetRequests count={assetRequests.length} />
          {assetRequestOptions.map((option) => (
            <LinearProgress
              key={option.label}
              label={option.label}
              color={option.color}
              percentage={option.percentage}
              icon={option.icon}
              displayValue={option.displayValue}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TotalAssetRequests({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-start justify-center">
      <div className="text-xs text-muted-foreground">Total Requests Received</div>
      <div className="text-2xl font-medium">{count} Requests</div>
    </div>
  );
}
