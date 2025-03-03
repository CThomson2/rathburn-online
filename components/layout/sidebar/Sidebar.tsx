"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { Sparkles } from "lucide-react";

interface SidebarProps {
  className?: string;
  isAuthLayout?: boolean;
}

interface NavLink {
  href: string;
  label: string;
  level: number;
  disabled?: boolean;
  highlight?: boolean;
}

export function Sidebar({ className, isAuthLayout = false }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  // Define navigation links based on page.tsx files with proper nesting
  const navLinks: NavLink[] = [
    { href: "/", label: "Home", level: 0 },
    { href: "/overview", label: "Overview", level: 1 },
    { href: "/inventory/dashboard", label: "Inventory Dashboard", level: 1 },
    { href: "/inventory/activity", label: "Inventory Activity", level: 1 },
    { href: "/inventory/drum-stock", label: "Drum Stock", level: 1 },
    { href: "/inventory/orders", label: "Orders", level: 1 },
    {
      href: "/inventory/orders/new",
      label: "New Order",
      level: 2,
      highlight: true,
    },
    { href: "/raw-materials", label: "Raw Materials", level: 1 },
  ];

  // Handle sidebar toggle when button is clicked
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsOpen((prev) => !prev);
    };

    const toggleBtn = document.querySelector("[data-toggle-sidebar]");
    toggleBtn?.addEventListener("click", handleToggleSidebar);

    return () => {
      toggleBtn?.removeEventListener("click", handleToggleSidebar);
    };
  }, []);

  return (
    <div
      className={cn(
        "w-64 bg-background border-r h-screen fixed left-0 top-0 pt-16 transition-transform duration-300 z-50",
        !isOpen && "-translate-x-full",
        className
      )}
    >
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isDisabled =
              isAuthLayout && link.href !== "/inventory/dashboard";

            return (
              <Link
                key={link.href}
                href={isDisabled ? "#" : link.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                  { "ml-2": link.level === 1 },
                  { "ml-4": link.level === 2 },
                  { "ml-6": link.level === 3 },
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isDisabled &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
                )}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                  }
                }}
                aria-disabled={isDisabled}
              >
                {link.label === "New Order" ? (
                  <div className="flex items-center font-bold">
                    <span>{link.label}</span>
                    <Sparkles className="ml-2 h-4 w-4" />
                  </div>
                ) : (
                  <span>{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
