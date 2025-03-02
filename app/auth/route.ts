import { NextResponse } from "next/server";

// This file redirects /inventory to /inventory/dashboard
export function GET() {
  return NextResponse.redirect(
    new URL(
      "/auth/login",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    )
  );
}
