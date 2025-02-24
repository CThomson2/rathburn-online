"use client";

import { cloneElement } from "react";
import {
  DashboardProvider,
  useDashboard,
} from "@/features/dashboard/context/dashboard-context";
import { ViewToggle } from "@/features/dashboard/components/view-toggle";
import { StockLevelsWidget as StockLevels } from "@/features/dashboard/components/widgets/stock-levels";
import { MaterialGroupsWidget } from "@/features/dashboard/components/widgets/material-groups";
import { ProductionWidget } from "@/features/dashboard/components/widgets/active-processes";
import { RecentOrdersWidget } from "@/features/dashboard/components/widgets/recent-orders";
import { StatsWidget } from "@/features/dashboard/components/widgets/top-stats";

// Define widget configurations with layout classes
const widgets = [
  {
    id: "stats",
    component: <StatsWidget id="stats" />,
    className: "col-span-full",
  },
  { id: "stock-levels", component: <StockLevels id="stock-levels" /> },
  {
    id: "material-groups",
    component: <MaterialGroupsWidget id="material-groups" />,
    className: "col-span-full lg:col-span-2",
  },
  { id: "recent-orders", component: <RecentOrdersWidget id="recent-orders" /> },
  { id: "production", component: <ProductionWidget id="production" /> },
];

export const DashboardContent = () => {
  const { view, favorites } = useDashboard();

  // Filter widgets based on the current view
  const visibleWidgets =
    view === "all"
      ? widgets
      : widgets.filter((widget) => favorites.includes(widget.id));

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <ViewToggle />
        </div>

        {view === "favorites" && visibleWidgets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No favorite widgets added yet. Customise your dashboard by
              clicking the star icon in the &quot;All Widgets&quot; view.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleWidgets.map(({ id, component, className }) => (
              <div key={id} className={className || ""}>
                {/* React.cloneElement allows us to clone a React element and pass additional props to it */}
                {cloneElement(component as React.ReactElement, { id })}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
