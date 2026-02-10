"use client";

import Container from "@/components/container";
import { useAtomValue } from "jotai";
import { ticketsAtom, assetRequestsAtom } from "@/lib/atoms";
import MetricCard from "./components/metric-card";

export default function Metrics() {
  const tickets = useAtomValue(ticketsAtom);
  const assetRequests = useAtomValue(assetRequestsAtom);

  const totalTickets = tickets.length;
  const unsolvedTickets = tickets.filter(t => t.currentStatus !== "Resolved" && t.currentStatus !== "Closed").length;
  const totalAssetRequests = assetRequests.length;
  const pendingAssetRequests = assetRequests.filter(r => r.status === "Pending").length;

  const metricsData = [
    {
      title: "Total Tickets",
      value: totalTickets.toLocaleString(),
      change: 0, // No historical data available yet
    },
    {
      title: "Unsolved Tickets",
      value: unsolvedTickets.toLocaleString(),
      change: 0,
    },
    {
      title: "Total Asset Requests",
      value: totalAssetRequests.toLocaleString(),
      change: 0,
    },
    {
      title: "Pending Asset Requests",
      value: pendingAssetRequests.toLocaleString(),
      change: 0,
    },
  ];

  return (
    <Container className="grid grid-cols-1 gap-y-6 border-b border-border py-4 phone:grid-cols-2 laptop:grid-cols-4">
      {metricsData.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </Container>
  );
}
