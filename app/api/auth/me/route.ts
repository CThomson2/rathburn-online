import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE_NAME, verifyToken } from "@/utils/auth";
import { findUserById } from "@/database/models/user";

/**
 * GET /api/auth/me
 *
 * Retrieves the current authenticated user's information based on their JWT token.
 * This endpoint is used to check if a user is logged in and to get their profile data.
 */
export async function GET() {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

    // If no token is present, return 401 Unauthorized
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = verifyToken(token);
    if (!decoded) {
      // Token is invalid, clear the cookie
      cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get the user from the database
    const user = await findUserById(decoded.id);
    if (!user) {
      // User not found in database, clear the cookie
      cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
