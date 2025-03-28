import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (redirectTo) {
    // Ensure the redirect path is valid
    const validRedirectPaths = ['/reset-password', '/inventory/dashboard'];
    const defaultRedirect = '/inventory/dashboard';
    
    // Check if the redirectTo path is in our valid paths, otherwise use default
    const isValidPath = validRedirectPaths.some(path => redirectTo.startsWith(path));
    const finalRedirect = isValidPath ? redirectTo : defaultRedirect;
    
    return NextResponse.redirect(`${origin}${finalRedirect}`);
  }

  // Default redirect after sign in/up
  return NextResponse.redirect(`${origin}/inventory/dashboard`);
}
