"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import { paths } from "/config/paths";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

interface GridCellProps {
  title: string;
  href?: string;
  description?: string;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary" | "success" | "active";
}

const GridCell = ({
  title,
  href,
  description,
  className = "",
  variant = "primary",
}: GridCellProps) => {
  const Wrapper = href ? motion.a : motion.div;
  const isDisabled = href === "#";

  const variantStyles = {
    primary: "bg-white dark:bg-gray-800",
    secondary: "bg-gray-50 dark:bg-gray-700",
    tertiary: "bg-white dark:bg-gray-800",
    success: "bg-green-500 dark:bg-green-300",
    active: "bg-blue-500 dark:bg-blue-300",
  };

  return (
    <Wrapper
      href={isDisabled ? undefined : href}
      className={`
        flex flex-col justify-center items-center p-6
        ${variantStyles[variant]}
        rounded-xl
        border border-gray-100 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${isDisabled ? "opacity-60 bg-gray-100 dark:bg-gray-600" : ""}
        ${
          !isDisabled && href
            ? "hover:scale-[1.02] hover:shadow-lg cursor-pointer"
            : ""
        }
        ${className}
      `}
      whileHover={isDisabled ? {} : { y: -2 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          {description}
        </p>
      )}
    </Wrapper>
  );
};

// Grid data structure
interface GridSectionItem {
  title: string;
  href: string;
  variant?: "primary" | "secondary" | "tertiary" | "success" | "active";
}

interface GridSection {
  title: string;
  className?: string;
  items: GridSectionItem[];
}

const gridSections: GridSection[] = [
  {
    title: "DASHBOARD",
    className: "col-span-3",
    items: [
      {
        title: "Operations",
        href: "inventory/dashboard",
        variant: "active",
      },
      { title: "Overview", href: "/dashboard", variant: "secondary" },
      { title: "SALES & TAX", href: "#", variant: "secondary" },
    ],
  },
  {
    title: "RAW MATERIALS",
    className: "col-span-3",
    items: [
      {
        title: "NEW ORDER",
        href: "/inventory/orders/new",
        variant: "success",
      },
      {
        title: "INVENTORY MANAGEMENT",
        href: "/inventory/activity",
        variant: "success",
      },
      { title: "REPRO DRUMS", href: "/materials/repro", variant: "secondary" },
    ],
  },
  /*
  {
    title: "REFERENCE INFO",
    href: "/reference",
    className: "col-span-3",
    items: [
      { title: "PRODUCT RANGE", href: "#" },
      { title: "MATERIALS", href: "#" },
      { title: "SUPPLIERS", href: "#" },
      // { title: "PRODUCT RANGE", href: "/reference/product-range" },
      // { title: "MATERIALS", href: "/reference/materials" },
      // { title: "SUPPLIERS", href: "/reference/suppliers" },
    ],
  },
*/
];

/**
 * HomeContent component that redirects users based on their authentication status:
 * - Authenticated users are redirected to the dashboard
 * - Unauthenticated users are redirected to the login page
 */
export function HomeContent() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  // Add diagnostic logging for redirect detection
  useEffect(() => {
    // Log all localStorage items for debugging
    console.log("DIAGNOSTIC: Checking localStorage for problematic entries");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        console.log(`DIAGNOSTIC: localStorage[${key}] = ${value}`);
      }
    }

    // Log all sessionStorage items
    console.log("DIAGNOSTIC: Checking sessionStorage for problematic entries");
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        console.log(`DIAGNOSTIC: sessionStorage[${key}] = ${value}`);
      }
    }

    // Check if there are any service workers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        console.log(
          `DIAGNOSTIC: Found ${registrations.length} service workers`
        );
        registrations.forEach((registration) => {
          console.log(
            `DIAGNOSTIC: Service worker scope: ${registration.scope}`
          );
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // If user is not authenticated, redirect to login
      // If authenticated, stay on the home page
      if (!user) {
        const loginPath = paths.auth.login.getHref();

        console.log(
          `DIAGNOSTIC: Redirecting unauthenticated user to: ${loginPath}`
        );
        console.log(`DIAGNOSTIC: User authenticated: ${!!user}`);

        // Only redirect if we're on the home page to avoid infinite loops
        if (window.location.pathname === "/") {
          router.replace(loginPath);
        }
      } else {
        console.log(`DIAGNOSTIC: User authenticated, staying on home page`);
      }
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking authentication
  return (
    <>
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
          <div className="max-w-[1400px] mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Inventory Management System
            </h1>

            <div className="space-y-8">
              {gridSections.map((section, index) => (
                <div key={index} className="space-y-1">
                  <GridCell
                    title={section.title}
                    className={section.className}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    {section.items.map((item, itemIndex) => (
                      <GridCell
                        key={itemIndex}
                        title={item.title}
                        href={item.href}
                        variant={item.variant}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
