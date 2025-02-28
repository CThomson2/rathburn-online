"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, TruckIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import { OrdersOverviewWidgetProps } from "@/types/models/orders";

export function RecentOrdersWidget({ orders }: OrdersOverviewWidgetProps) {
  // Sort orders by date (newest first)
  const sortedOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.date_ordered).getTime() - new Date(a.date_ordered).getTime()
    )
    .slice(0, 5); // Show only the 5 most recent orders

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <CardDescription>Latest material orders</CardDescription>
        </div>
        <Link
          href="/inventory/orders"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left font-medium">Supplier</th>
                <th className="py-3 text-left font-medium">Material</th>
                <th className="py-3 text-left font-medium">Quantity</th>
                <th className="py-3 text-left font-medium">Date</th>
                <th className="py-3 text-left font-medium">Status</th>
                <th className="py-3 text-left font-medium">PO Number</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.order_id} className="border-b hover:bg-muted/50">
                  <td className="py-3">{order.supplier}</td>
                  <td className="py-3">{order.material}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <PackageIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{order.quantity}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(order.date_ordered), "dd MMM yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3">{order.po_number || "-"}</td>
                </tr>
              ))}

              {sortedOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pending
        </Badge>
      );
    case "delivered":
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Delivered
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Cancelled
        </Badge>
      );
    case "partial":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Partial
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          {status}
        </Badge>
      );
  }
}
