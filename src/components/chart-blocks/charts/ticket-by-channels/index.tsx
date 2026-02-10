"use client";

import { Rss } from "lucide-react";
import { useAtomValue } from "jotai";
import { assetRequestsAtom } from "@/lib/atoms";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";

export default function TicketByChannels() {
  const assetRequests = useAtomValue(assetRequestsAtom);

  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Asset Requests By Sections" icon={Rss} />
      <div className="relative flex min-h-64 flex-grow flex-col justify-center">
        <Chart data={assetRequests} />
      </div>
    </section>
  );
}
