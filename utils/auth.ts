import { cookies } from "next/headers";

export const AUTH_TOKEN_COOKIE_NAME = "insert_react_app_token";

/**
 * Retrieves the authentication token from the cookies.
 * Returns an empty string if executed on the client side.
 * @returns {string | undefined} The authentication token or undefined if not found.
 */
export function getAuthTokenCookie(): string | undefined {
  if (typeof window !== "undefined") return "";
  const cookieStore = cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
}

/**
 * Checks if the user is logged in by verifying the presence of the authentication token in the cookies.
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
export function checkLoggedIn(): boolean {
  const cookieStore = cookies();
  const isLoggedIn = !!cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
  return isLoggedIn;
}
