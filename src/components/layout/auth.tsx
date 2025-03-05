"use client";
import { ReactNode } from "react";
import { paths } from "/config/paths";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

import { useUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";

export function AuthLayoutContent({ children }: { children: ReactNode }) {
  const user = useUser();
  const isLoggedIn = !!user.data;

  return (
    <>
      {/* Include the sidebar with auth restrictions */}
      <Sidebar isAuthLayout={true} />

      {/* Full-page background image */}
      <div className="fixed inset-0">
        <Image
          src="/images/auth-bg.jpeg"
          alt="Auth Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex h-screen w-full overflow-hidden">
        {/* Left half - empty space */}
        <div className="w-1/2 opacity-20 -z-10" />

        {/* Right half - semi-transparent login/register form */}
        <div className="w-1/2 bg-violet-50/55 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="w-full max-w-md p-4 bg-violet-50 rounded-lg shadow-md">
            {/* Home icon link above the form */}
            <div className="mb-8 flex justify-center">
              <Link
                className={cn(
                  "flex items-center text-violet-500 hover:text-violet-700 transition-colors",
                  !isLoggedIn && "pointer-events-none opacity-50"
                )}
                href={isLoggedIn ? paths.inventory.root.getHref() : "#"}
                aria-disabled={!isLoggedIn}
              >
                <Home size={36} />
              </Link>
            </div>

            {/* Form content */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
