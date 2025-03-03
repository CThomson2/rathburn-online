import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME } from "@/utils/auth";
import { invalidateSession } from "@/database/models/user";

/**
 * POST /api/auth/logout
 *
 * Logs out the current user by clearing their authentication cookie
 * and invalidating their session in the database.
 * This effectively ends the user's session.
 */
export async function POST() {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

    // If token exists, invalidate the session in the database
    if (token) {
      await invalidateSession(token);
    }

    // Delete the auth token cookie
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
