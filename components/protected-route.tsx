"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import { paths } from "@/config/paths";
import { ReactNode, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<"ADMIN" | "USER">;
};

/**
 * ProtectedRoute component that ensures the user is authenticated
 * and has the required role before rendering children.
 *
 * Features:
 * - Redirects unauthenticated users to the login page
 * - Validates user roles based on allowedRoles prop
 * - Shows loading state while checking authentication
 * - Preserves the current path in redirectTo for a seamless experience
 *
 * @param {ReactNode} children - The content to render if authenticated
 * @param {Array<string>} allowedRoles - Optional list of roles that can access this route
 */
export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        const currentPath = window.location.pathname;
        router.replace(paths.auth.login.getHref(currentPath));
        return;
      }

      // If roles are specified and user doesn't have a required role, redirect to dashboard
      if (allowedRoles && allowedRoles.length > 0) {
        if (!user.role || !allowedRoles.includes(user.role)) {
          router.replace(paths.inventory.root.getHref());
        }
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If authenticated and role check passes, render children
  // Don't render at all if not authenticated or role check fails
  if (user) {
    if (allowedRoles && allowedRoles.length > 0) {
      return allowedRoles.includes(user.role) ? <>{children}</> : null;
    }
    return <>{children}</>;
  }

  return null;
};
