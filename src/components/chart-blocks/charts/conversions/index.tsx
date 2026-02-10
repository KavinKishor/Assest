"use client";

import { CirclePercent } from "lucide-react";
import { useAtomValue } from "jotai";
import { assetRequestsAtom, ticketsAtom } from "@/lib/atoms";
import { addThousandsSeparator } from "@/lib/utils";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";

export default function Convertions() {
  const assetRequests = useAtomValue(assetRequestsAtom);
  const tickets = useAtomValue(ticketsAtom);

  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Overall Status Overview" icon={CirclePercent} />
      <Indicator total={assetRequests.length + tickets.length} />
      <div className="relative max-h-80 flex-grow">
        <Chart assetData={assetRequests} ticketData={tickets} />
      </div>
    </section>
  );
}

function Indicator({ total }: { total: number }) {
  return (
    <div className="mt-3">
      <span className="mr-1 text-2xl font-medium">
        {addThousandsSeparator(total)}
      </span>
      <span className="text-muted-foreground/60">Requests</span>
    </div>
  );
}
