import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Sidebar } from "@/components/layout/sidebar/Sidebar";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Rathburn",
  description: "Inventory Management System",
  icons: {
    icon: "/public/rc-logo-b.png",
  },
};

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Add Sidebar to all routes in this group */}
      <Sidebar />
      {children}
    </>
  );
}
