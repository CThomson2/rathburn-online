import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Spinner } from "@/components/ui/spinner";

import { AuthLayout as AuthLayoutComponent } from "./_components/auth-layout";

/**
 * Metadata for authentication pages
 * This provides SEO information for all auth-related pages
 */
export const metadata = {
  title: "Rathburn Online Inventory",
  description: "Welcome to Rathburn Online Inventory!",
};

/**
 * Root layout for authentication pages (/auth/*)
 *
 * This server component wraps the client-side AuthLayoutComponent with:
 * - Suspense boundary: Shows a spinner while content is loading
 * - Error boundary: Provides fallback UI if rendering fails
 *
 * Key differences of auth/layout.tsx from _components/auth-layout.tsx:
 * - This is a server component (no "use client" directive)
 * - Handles loading states and error boundaries
 * - Sets metadata for SEO
 * - Acts as the Next.js layout file for the /auth route segment
 *
 * While _components/auth-layout.tsx:
 * - Is a client component with access to client-side hooks
 * - Handles authentication redirects
 * - Manages the visual layout and styling
 * - Contains business logic for auth page titles and redirects
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render within the layout
 * @returns {JSX.Element} The authentication layout with error and loading boundaries
 */
const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary fallback={<div>Something went wrong!</div>}>
        <AuthLayoutComponent>{children}</AuthLayoutComponent>
      </ErrorBoundary>
    </Suspense>
  );
};

export default AuthLayout;
