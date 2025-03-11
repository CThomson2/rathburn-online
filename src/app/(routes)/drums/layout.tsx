"use client";

import { useSidebar } from "@/utils/use-sidebar";

export default function DrumsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <main
      className={`flex-1 transition-all duration-300 ease-in-out ${
        isOpen ? "ml-64" : "ml-0"
      }`}
    >
      {children}
    </main>
  );
}
