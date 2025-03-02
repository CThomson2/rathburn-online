"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Home } from "lucide-react";

import { Link } from "@/components/ui/link";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { cn } from "@/utils/cn";

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

  const isLoggedIn = !!user.data;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
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
  );
};
