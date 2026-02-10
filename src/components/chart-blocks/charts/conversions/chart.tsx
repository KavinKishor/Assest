"use client";

import { useMemo } from "react";
import { VChart } from "@visactor/react-vchart";
import type { ICirclePackingChartSpec } from "@visactor/vchart";
import { addThousandsSeparator } from "@/lib/utils";

export default function Chart({ assetData, ticketData }: { assetData: { status?: string }[], ticketData: { currentStatus?: string }[] }) {
  const chartData = useMemo(() => {
    const results: { name: string; value: number }[] = [];

    if (assetData && assetData.length > 0) {
      const assetGrouped = assetData.reduce((acc: Record<string, number>, item) => {
        const k = `Asset ${item.status || "Pending"}`;
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});
      Object.entries(assetGrouped).forEach(([name, value]) => {
        results.push({ name, value });
      });
    }

    if (ticketData && ticketData.length > 0) {
      const ticketGrouped = ticketData.reduce((acc: Record<string, number>, item) => {
        const k = `Ticket ${item.currentStatus || "Open"}`;
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});
      Object.entries(ticketGrouped).forEach(([name, value]) => {
        results.push({ name, value });
      });
    }

    return results;
  }, [assetData, ticketData]);

  const spec: ICirclePackingChartSpec = useMemo(() => ({
    data: [
      {
        id: "data",
        values: chartData,
      },
    ],
    type: "circlePacking",
    categoryField: "name",
    valueField: "value",
    drill: true,
    padding: 0,
    layoutPadding: 5,
    label: {
      style: {
        fill: "white",
        stroke: false,
        visible: (d) => d.depth === 0,
        text: (d) => addThousandsSeparator(d.value),
        fontSize: (d) => Math.min(d.radius / 1.5, 24),
        dy: (d) => d.radius / 8,
      },
    },
    legends: [
      {
        visible: true,
        orient: "top",
        position: "start",
        padding: 0,
        item: {
          label: {
            style: {
              fontSize: 10,
            }
          }
        }
      },
    ],
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        content: {
          value: (d) => addThousandsSeparator(d?.value),
        },
      },
    },
    animationEnter: {
      easing: "cubicInOut",
    },
    animationExit: {
      easing: "cubicInOut",
    },
    animationUpdate: {
      easing: "cubicInOut",
    },
  }), [chartData]);

  return <VChart spec={spec} />;
}
