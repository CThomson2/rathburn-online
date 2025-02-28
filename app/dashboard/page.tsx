"use client";

import { DashboardContent } from "./_components/content";
import { DashboardProvider } from "@/context";

const DashboardPage = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default DashboardPage;
