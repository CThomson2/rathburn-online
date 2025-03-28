"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

interface DatabaseBtnProps {
  databasePath?: string;
  className?: string;
}

/**
 * Component that adds a link to view the database in Supabase
 * Only shows in development mode
 */
export function DatabaseBtn({
  databasePath = "/database",
  className,
}: DatabaseBtnProps) {
  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="group relative overflow-hidden transition-all duration-300 hover:bg-accent/50 hover:shadow-md"
      >
        <Link href={`${databasePath}`} target="_blank">
          <Database className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
          <span className="relative">
            Go to Database
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </span>
        </Link>
      </Button>
    </div>
  );
}

export default DatabaseBtn;
