"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import { OrdersOverviewWidgetProps } from "@/types/models/orders";

export function OrdersOverviewWidget({ orders }: OrdersOverviewWidgetProps) {
  const stats = useMemo(() => {
    // Calculate summary statistics
    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;
    const totalQuantityOrdered = orders.reduce(
      (sum, order) => sum + order.quantity,
      0
    );
    const totalQuantityReceived = orders.reduce(
      (sum, order) => sum + order.quantity_received,
      0
    );
    const pendingQuantity = totalQuantityOrdered - totalQuantityReceived;

    // Get unique suppliers and materials
    const uniqueSuppliers = new Set(orders.map((order) => order.supplier)).size;
    const uniqueMaterials = new Set(orders.map((order) => order.material)).size;

    return {
      pendingOrders,
      totalQuantityOrdered,
      totalQuantityReceived,
      pendingQuantity,
      uniqueSuppliers,
      uniqueMaterials,
      totalOrders: orders.length,
    };
  }, [orders]);

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <CardDescription>Orders awaiting delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingOrders > 0
              ? `${stats.pendingQuantity} units pending delivery`
              : "All orders fulfilled"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Ordered</CardTitle>
          <CardDescription>All time quantity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuantityOrdered}</div>
          <p className="text-xs text-muted-foreground">
            Across {stats.totalOrders} orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Received</CardTitle>
          <CardDescription>Total received quantity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalQuantityReceived}
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round(
              (stats.totalQuantityReceived / stats.totalQuantityOrdered) * 100
            )}
            % of ordered
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Materials</CardTitle>
          <CardDescription>Unique materials ordered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueMaterials}</div>
          <p className="text-xs text-muted-foreground">
            From {stats.uniqueSuppliers} suppliers
          </p>
        </CardContent>
      </Card>
    </>
  );
}
