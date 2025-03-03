"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import { paths } from "@/config/paths";
import { Spinner } from "@/components/ui/spinner";

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
      // Add detailed logging for redirect
      const targetPath = user
        ? paths.inventory?.root?.getHref() || "/"
        : paths.auth.login.getHref();

      console.log(`DIAGNOSTIC: Redirecting user to: ${targetPath}`);
      console.log(`DIAGNOSTIC: User authenticated: ${!!user}`);
      console.log(
        `DIAGNOSTIC: Available paths:`,
        JSON.stringify(paths, null, 2)
      );

      if (user) {
        // User is authenticated, redirect to dashboard
        router.replace(paths.inventory.root.getHref());
      } else {
        // User is not authenticated, redirect to login
        router.replace(paths.auth.login.getHref());
      }
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking authentication
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
