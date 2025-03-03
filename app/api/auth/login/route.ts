import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AUTH_TOKEN_COOKIE_NAME,
  generateToken,
  verifyPassword,
  setAuthCookie,
} from "@/utils/auth";
import {
  findUserWithPasswordByEmail,
  createSession,
} from "@/database/models/user";

/**
 * POST /api/auth/login
 *
 * Authenticates a user with their email and password.
 * If successful, sets a JWT token cookie and returns the user data.
 *
 * Request body:
 * {
 *   email: string,
 *   password: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    console.log("Login attempt started");

    let body;
    try {
      body = await request.json();
      console.log("Request body parsed:", body);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { message: "Invalid request body format" },
        { status: 400 }
      );
    }

    const { email, password } = body;
    console.log("Credentials received:", {
      email: email ? "provided" : "missing",
      password: password ? "provided" : "missing",
    });

    // Validate input
    if (!email || !password) {
      console.log("Validation failed: Missing email or password");
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await findUserWithPasswordByEmail(email);
    console.log("User lookup result:", user ? "User found" : "User not found");

    // If user not found or password doesn't match, return error
    if (!user) {
      console.log("Authentication failed: User not found");
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    console.log(
      "Password verification result:",
      isPasswordValid ? "Valid" : "Invalid"
    );

    if (!isPasswordValid) {
      console.log("Authentication failed: Invalid password");
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("Authentication successful, generating token");
    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session record
    await createSession(
      user.id,
      token,
      request.headers.get("user-agent") || undefined,
      request.headers.get("x-forwarded-for") || request.ip
    );

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    // Set the JWT token as an HTTP-only cookie
    console.log("Setting authentication cookie");
    setAuthCookie(response, token);
    console.log("Cookie set successfully");

    return response;
  } catch (error) {
    console.error("Login error:", error);
    // More detailed error information
    const errorDetails = {
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
    console.error("Error details:", errorDetails);

    return NextResponse.json(
      {
        message: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}
