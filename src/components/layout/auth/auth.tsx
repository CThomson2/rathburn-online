"use client";
import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import SupabaseLogo from "@/components/layout/supabase-logo";
import { cn } from "@/lib/utils";

export function AuthLayoutContent({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex">
      {/* Left section with background */}
      <div className="hidden lg:block lg:w-[60%] xl:w-[65%] relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        {/* Background overlay with blur */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent)] backdrop-blur-[2px]" />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 pointer-events-none mt-16">
          <div className="absolute left-8 top-8 grid grid-cols-6 gap-2">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
            ))}
          </div>
          <div className="absolute right-8 bottom-8 grid grid-cols-6 gap-2">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
            ))}
          </div>
        </div>

        {/* Left section content - Centered */}
        <div className="relative h-full flex items-center">
          <div className="px-32">
            <h1 className="text-6xl font-bold tracking-tight text-white mb-12">
              Inventory
              <br />
              Management
              <br />
              System
            </h1>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <span className="text-xl font-medium text-white">
                  Data Analytics
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path
                      fillRule="evenodd"
                      d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xl font-medium text-white">
                  Stock Management
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xl font-medium text-white">
                  Order Tracking
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xl font-medium text-white">
                  Real-time Updates
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - Absolute positioned at bottom */}
        <div className="absolute bottom-8 left-16 text-sm text-white/60">
          © 2024 Rathburn. All rights reserved.
        </div>
      </div>

      {/* Right section with form */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* <div className="w-full h-12 mb-12">
            <SupabaseLogo />
          </div> */}
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
