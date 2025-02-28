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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { DrumStatus } from "@/types/models/drums/constant";
import { DrumWidgetProps } from "@/types/models/drums";

// Status colors
const STATUS_COLORS = {
  pending: "#f59e0b", // Amber
  intake: "#3b82f6", // Blue
  processed: "#10b981", // Emerald
  loaded: "#8b5cf6", // Violet
  cancelled: "#ef4444", // Red
  failed: "#f43f5e", // Rose
  disposed: "#6b7280", // Gray
  lost: "#1f2937", // Dark Gray
  requeued: "#0ea5e9", // Sky
  scheduled: "#a855f7", // Purple
  default: "#64748b", // Slate
};

export function DrumStatusWidget({ drums }: DrumWidgetProps) {
  const chartData = useMemo(() => {
    // Count drums by status
    const statusCounts: Record<string, number> = {};

    drums.forEach((drum) => {
      const status = drum.status.toLowerCase();
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Convert to array format for chart
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
      value: count,
      color:
        STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
        STATUS_COLORS.default,
    }));
  }, [drums]);

  // Calculate total drums
  const totalDrums = drums.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Drum Status</CardTitle>
        <CardDescription>Distribution by current status</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} drums`, "Count"]}
                  labelFormatter={(name) => `Status: ${name}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No drum data available</p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Drums</p>
            <p className="text-xl font-bold">{totalDrums}</p>
          </div>

          {chartData.length > 0 && (
            <div>
              <p className="text-muted-foreground">Most Common</p>
              <p className="text-xl font-bold">
                {chartData.sort((a, b) => b.value - a.value)[0]?.name || "N/A"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
