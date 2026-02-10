"use client";

import { VChart } from "@visactor/react-vchart";
import type { ILinearProgressChartSpec } from "@visactor/vchart";
import type { Datum } from "@visactor/vchart/esm/typings";
import { numberToPercentage } from "@/lib/utils";

const getSpec = (
  label: string,
  color: string,
  percentage: number,
): ILinearProgressChartSpec => {
  return {
    type: "linearProgress",
    data: [
      {
        id: "id0",
        values: [
          {
            type: label,
            value: percentage,
          },
        ],
      },
    ],
    direction: "horizontal",
    xField: "value",
    yField: "type",
    seriesField: "type",
    height: 20,
    cornerRadius: 10,
    progress: {
      style: {
        cornerRadius: 10,
      },
    },
    track: {
      style: {
        fill: "rgba(0,0,0,0.05)",
      }
    },
    color: [color],
    bandWidth: 20,
    padding: 0,
    tooltip: {
      trigger: ["click", "hover"],
      mark: {
        title: {
          visible: false,
        },
        content: [
          {
            key: label,
            value: (datum: Datum | undefined) =>
              datum ? `${percentage}%` : "",
          },
        ],
      },
    },
    axes: [
      {
        orient: "left",
        type: "band",
        visible: false,
      },
      {
        orient: "bottom",
        type: "linear",
        visible: false,
        min: 0,
        max: 100,
      },
    ],
  };
};

export default function LinearProgress({
  label,
  color,
  percentage,
  icon,
  displayValue,
}: {
  label: string;
  color: string;
  percentage: number;
  icon: React.ReactNode;
  displayValue?: string;
}) {
  const valueToShow = displayValue || numberToPercentage(percentage);

  return (
    <div>
      <div className="mb-1 flex items-center gap-x-2">
        {icon}
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-medium">
            {valueToShow}
          </div>
        </div>
      </div>
      <div className="relative">
        <VChart spec={getSpec(label, color, percentage)} />
      </div>
    </div>
  );
}
