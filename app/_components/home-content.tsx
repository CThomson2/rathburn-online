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

  useEffect(() => {
    if (!isLoading) {
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
