"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Home } from "lucide-react";

import { Link } from "@/components/ui/link";
import { paths } from "/config/paths";
import { useUser } from "@/lib/auth";
import { cn } from "@/utils/cn";
import { Sidebar } from "@/components/layout/sidebar";

/**
 * AuthLayout component provides a consistent layout for authentication pages.
 *
 * Features:
 * - Automatically redirects authenticated users to their dashboard or a specified redirect URL
 * - Displays different titles based on the current auth page (login vs register)
 * - Provides a centered card layout with the application logo
 * - Responsive design that works on all screen sizes
 *
 * @param {ReactNode} children - The content to render within the auth layout
 * @returns {JSX.Element} The rendered auth layout component
 */
type LayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === paths.auth.login.getHref();
  const title = isLoginPage
    ? "Log in to your account"
    : "Register your account";

  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect authenticated users to dashboard or specified redirect URL
  useEffect(() => {
    if (user.data) {
      router.replace(
        `${
          redirectTo
            ? `${decodeURIComponent(redirectTo)}`
            : paths.inventory.root.getHref()
        }`
      );
    }
  }, [user.data, router, redirectTo]);

  // Check sidebar state from HTML class
  useEffect(() => {
    const updateSidebarState = () => {
      setIsSidebarOpen(
        document.documentElement.classList.contains("sidebar-open")
      );
    };

    // Initial check
    updateSidebarState();

    // Set up a mutation observer to detect class changes on the HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          updateSidebarState();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Also listen for the sidebar toggle button clicks
    const toggleBtn = document.querySelector("[data-toggle-sidebar]");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", updateSidebarState);
    }

    return () => {
      observer.disconnect();
      if (toggleBtn) {
        toggleBtn.removeEventListener("click", updateSidebarState);
      }
    };
  }, []);

  const isLoggedIn = !!user.data;

  return (
    <>
      {/* Include the sidebar with auth restrictions */}
      <Sidebar isAuthLayout={true} />

      <div
        className={cn(
          "flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8 transition-all duration-300",
          isSidebarOpen ? "pl-64" : "pl-0"
        )}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link
              className={cn(
                "flex items-center text-gray-400 hover:text-gray-600 transition-colors",
                !isLoggedIn && "pointer-events-none opacity-50"
              )}
              href={isLoggedIn ? paths.inventory.root.getHref() : "#"}
              aria-disabled={!isLoggedIn}
            >
              <Home size={48} />
            </Link>
          </div>

          <h2 className="mt-3 text-center text-3xl font-extrabold text-foreground">
            {title}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
