"use client";

import { useMemo } from "react";
import {
  type IPieChartSpec,
  VChart,
} from "@visactor/react-vchart";
import type { Datum } from "@visactor/vchart/esm/typings";
import { addThousandsSeparator } from "@/lib/utils";

export default function Chart({ data }: { data: { section?: string }[] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group by section
    const grouped = data.reduce((acc: Record<string, number>, item) => {
      const section = item.section || "Other";
      acc[section] = (acc[section] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([type, value]) => ({
      type,
      value,
    }));
  }, [data]);

  const totalRequests = useMemo(() =>
    chartData.reduce((acc: number, curr: { value: number }) => acc + curr.value, 0)
    , [chartData]);

  const spec: IPieChartSpec = useMemo(() => ({
    type: "pie",
    legends: [
      {
        type: "discrete",
        visible: true,
        orient: "bottom",
      },
    ],
    data: [
      {
        id: "id0",
        values: chartData,
      },
    ],
    valueField: "value",
    categoryField: "type",
    outerRadius: 1,
    innerRadius: 0.88,
    startAngle: -180,
    padAngle: 0.6,
    endAngle: 0,
    centerY: "80%",
    layoutRadius: "auto",
    pie: {
      style: {
        cornerRadius: 6,
      },
    },
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        title: {
          visible: false,
        },
        content: [
          {
            key: (datum: Datum | undefined) => datum?.type,
            value: (datum: Datum | undefined) => datum?.value,
          },
        ],
      },
    },
    indicator: [
      {
        visible: true,
        offsetY: "40%",
        title: {
          style: {
            text: "Total Requests",
            fontSize: 16,
            opacity: 0.6,
          },
        },
      },
      {
        visible: true,
        offsetY: "64%",
        title: {
          style: {
            text: addThousandsSeparator(totalRequests),
            fontSize: 28,
          },
        },
      },
    ],
  }), [chartData, totalRequests]);

  return <VChart spec={spec} />;
}
