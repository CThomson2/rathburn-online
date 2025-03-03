import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE_NAME,
  hashPassword,
  generateToken,
  setAuthCookie,
} from "@/utils/auth";
import {
  findUserByEmail,
  createUser,
  createSession,
} from "@/database/models/user";

/**
 * POST /api/auth/register
 *
 * Registers a new user with the provided information.
 * If successful, sets a JWT token cookie and returns the user data.
 *
 * Request body:
 * {
 *   email: string,
 *   firstName: string,
 *   lastName: string,
 *   password: string,
 *   role: string (defaults to "USER")
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, password, role = "USER" } = body;

    // Validate input
    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password validation - at least 8 characters with one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters and include one uppercase letter, one lowercase letter, and one number",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create the user
    const user = await createUser({
      email,
      firstName,
      lastName,
      passwordHash,
      role,
    });

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
    const response = NextResponse.json({ user });

    // Set the JWT token as an HTTP-only cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
