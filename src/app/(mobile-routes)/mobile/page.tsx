import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Package, Scan, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Mobile Dashboard",
  description: "Mobile inventory management system",
};

export default function MobileDashboardPage() {
  return (
    <div className="space-y-4 py-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/mobile/scan" className="block">
          <Card className="h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Scan className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-base">Scan Item</CardTitle>
            </CardContent>
          </Card>
        </Link>

        <Link href="/mobile/inventory" className="block">
          <Card className="h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Package className="h-10 w-10 text-primary mb-3" />
              <CardTitle className="text-base">Inventory</CardTitle>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Your latest inventory actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Example activity items - replace with real data */}
            <ActivityItem
              title="Scanned Item #A2341"
              timestamp="10 minutes ago"
              icon={<Scan className="h-4 w-4" />}
            />
            <ActivityItem
              title="Updated Inventory Count"
              timestamp="2 hours ago"
              icon={<Package className="h-4 w-4" />}
            />
            <ActivityItem
              title="Received Shipment #ORD9988"
              timestamp="Yesterday"
              icon={<Package className="h-4 w-4" />}
            />
          </div>

          <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
            <Link href="/mobile/activity">
              View All Activity
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for activity items
function ActivityItem({
  title,
  timestamp,
  icon,
}: {
  title: string;
  timestamp: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-xs text-muted-foreground flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          {timestamp}
        </p>
      </div>
    </div>
  );
}
