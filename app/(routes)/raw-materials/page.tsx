"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// ...other shadcn/ui imports...
import { OrdersGrid } from "@/features/orders/components";
import { DrumsTable } from "@/features/drums-table/components";
// or whatever your import paths are

export default function InventoryDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
        {/* Example: Global action or theme toggle */}
        <Button variant="secondary">Settings</Button>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">123</div>
            <p className="text-sm text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Drums</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">48</div>
            <p className="text-sm text-muted-foreground">Arriving soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In-Stock Drums</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">312</div>
            <p className="text-sm text-muted-foreground">-5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">1,024</div>
            <p className="text-sm text-muted-foreground">All-time</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Charts or Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Example: Bar Chart Card */}
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle>Stock Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Replace with your chart component, e.g. Recharts, Nivo, etc. */}
            <div className="h-full flex items-center justify-center">
              <span className="text-muted-foreground">[Chart Placeholder]</span>
            </div>
          </CardContent>
        </Card>

        {/* Example: Pie Chart Card */}
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle>Drum Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Another chart or data viz */}
            <div className="h-full flex items-center justify-center">
              <span className="text-muted-foreground">[Chart Placeholder]</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Detailed Tables */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="drums">Drums</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {/* Replace with a new OrdersGrid or simplified version 
                that fits the dashboard styling. */}
          <OrdersGrid />
        </TabsContent>

        <TabsContent value="drums">{/* <DrumsTable /> */}</TabsContent>
      </Tabs>
    </div>
  );
}
