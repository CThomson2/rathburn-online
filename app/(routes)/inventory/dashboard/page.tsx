import { Suspense } from "react";
import {
  queries as drumQueries,
  DrumBatch,
  FormattedDrum,
} from "@/database/models/drums";
import {
  queries as orderQueries,
  Order,
  FormattedOrder,
} from "@/database/models/orders";
import { DrumStatus } from "@/types/models/drums/constant";
import { formatDates, createFormatter } from "@/utils/formatters/data";

// Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionButton } from "@/components/shared/table/header/action-button";
import { OrdersOverviewWidget } from "@/features/orders/components/widgets/orders-overview";
import { RecentOrdersWidget } from "@/features/orders/components/widgets/recent-orders";
import { DrumStatusWidget } from "@/features/drums-table/components/widgets/drum-status";
import { MaterialDistributionWidget } from "@/features/drums-table/components/widgets/material-distribution";
import { Skeleton } from "@/components/ui/skeleton";
import { orders } from "@/database/models";

export const metadata = {
  title: "Inventory Dashboard | Rathburn Dashboard",
  description: "Comprehensive view of inventory, orders, and drum status",
};

// Loading fallbacks
const OrdersOverviewSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Orders Overview</CardTitle>
      <CardDescription>Summary of all material orders</CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[120px]" />
        </div>
      ))}
    </CardContent>
  </Card>
);

const RecentOrdersSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Recent Orders</CardTitle>
      <CardDescription>Latest material orders</CardDescription>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
);

const DrumStatusSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Drum Status</CardTitle>
      <CardDescription>Current inventory status</CardDescription>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
);

const MaterialDistributionSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Material Distribution</CardTitle>
      <CardDescription>Breakdown by material type</CardDescription>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
);

async function InventoryDashboardPage() {
  try {
    // Fetch initial data server-side (will be passed to client components)
    console.log("[Server] Fetching dashboard data");

    // We'll fetch this data in parallel for better performance
    const [ordersResponse, drumsResponse] = await Promise.all([
      orderQueries.getOrders({ page: 1, limit: 10 }),
      drumQueries.getDrums({
        page: 1,
        limit: 50,
        sortField: "drum_id",
        sortOrder: "desc",
        status: Object.values(DrumStatus),
      }),
    ]);

    const orderFormatter = createFormatter<Order, FormattedOrder>([
      "date_ordered",
      "created_at",
      "updated_at",
      "eta_start",
      "eta_end",
      "po_number",
    ]);

    const drumFormatter = createFormatter<DrumBatch, FormattedDrum>([
      "date_processed",
      "date_ordered",
      "created_at",
      "updated_at",
    ]);

    const [ordersData, drumsData] = [
      ordersResponse.orders.map((order) => orderFormatter(order)),
      drumsResponse.drums.map((drum) => drumFormatter(drum)),
    ];

    console.log(
      `[Server] Successfully fetched ${drumsData.length} drums and ${ordersData.length} orders`
    );

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
          <div className="flex gap-2">
            <ActionButton text="Create Order" href="/inventory/orders/create" />
            <ActionButton text="View All Orders" href="/inventory/orders" />
            <ActionButton text="View All Drums" href="/inventory" />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Top row - Summary cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Suspense fallback={<OrdersOverviewSkeleton />}>
                <OrdersOverviewWidget orders={ordersData} />
              </Suspense>
            </div>

            {/* Middle row - Charts and graphs */}
            <div className="grid gap-4 md:grid-cols-2">
              <Suspense fallback={<DrumStatusSkeleton />}>
                <DrumStatusWidget drums={drumsData} />
              </Suspense>
              <Suspense fallback={<MaterialDistributionSkeleton />}>
                <MaterialDistributionWidget drums={drumsData} />
              </Suspense>
            </div>

            {/* Bottom row - Recent activity */}
            <div className="grid gap-4 md:grid-cols-1">
              <Suspense fallback={<RecentOrdersSkeleton />}>
                <RecentOrdersWidget orders={ordersData} />
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
                <CardDescription>
                  View and manage all material orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* We'll embed a simplified version of the orders grid here */}
                <p className="text-sm text-muted-foreground">
                  This tab will contain a more detailed view of all orders.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Drum Inventory</CardTitle>
                <CardDescription>
                  View and manage all drums in inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* We'll embed a simplified version of the drums table here */}
                <p className="text-sm text-muted-foreground">
                  This tab will contain a more detailed view of all drums in
                  inventory.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("[Server] Error fetching dashboard data:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
          <div className="flex gap-2">
            <ActionButton text="Create Order" href="/inventory/orders/create" />
            <ActionButton text="View All Orders" href="/inventory/orders" />
            <ActionButton text="View All Drums" href="/inventory" />
          </div>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">
              Error Loading Dashboard
            </CardTitle>
            <CardDescription className="text-red-600">
              There was a problem loading the dashboard data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              Please try refreshing the page. If the problem persists, contact
              support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default InventoryDashboardPage;
