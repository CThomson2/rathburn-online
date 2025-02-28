"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DrumWidgetProps } from "@/types/models/drums";

// Material colors - using a color palette that's visually distinct
const MATERIAL_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ef4444", // Red
  "#0ea5e9", // Sky
  "#a855f7", // Purple
  "#f43f5e", // Rose
  "#84cc16", // Lime
  "#14b8a6", // Teal
];

export function MaterialDistributionWidget({ drums }: DrumWidgetProps) {
  const chartData = useMemo(() => {
    // Count drums by material
    const materialCounts: Record<string, number> = {};

    drums.forEach((drum) => {
      const material = drum.material;
      materialCounts[material] = (materialCounts[material] || 0) + 1;
    });

    // Sort by count (descending) and take top 10
    const sortedMaterials = Object.entries(materialCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Convert to array format for chart
    return sortedMaterials.map(([material, count], index) => ({
      name: material,
      count,
      color: MATERIAL_COLORS[index % MATERIAL_COLORS.length],
    }));
  }, [drums]);

  // Calculate total unique materials
  const uniqueMaterialsCount = useMemo(() => {
    return new Set(drums.map((drum) => drum.material)).size;
  }, [drums]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Material Distribution</CardTitle>
        <CardDescription>Top materials by drum count</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    value.length > 15 ? `${value.substring(0, 15)}...` : value
                  }
                />
                <Tooltip
                  formatter={(value: number) => [`${value} drums`, "Count"]}
                  labelFormatter={(name) => `Material: ${name}`}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No material data available</p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Unique Materials</p>
            <p className="text-xl font-bold">{uniqueMaterialsCount}</p>
          </div>

          {chartData.length > 0 && (
            <div>
              <p className="text-muted-foreground">Most Common</p>
              <p className="text-xl font-bold">{chartData[0]?.name || "N/A"}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
