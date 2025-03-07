import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { RouteAwareControls } from "@/components/layout/route-aware-controls";
import { Providers } from "./providers";
import { ThemeProvider } from "@/app/providers/theme-provider";

import "@/styles/globals.css";
// import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
// import { navItems } from "@/content/main";

// Add this line to make the entire app dynamic
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Rathburn",
  description: "Inventory Management System",
  icons: {
    icon: "/public/rc-logo-b.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/rc-logo-b.png" sizes="any" />
        {/* Add diagnostic script to detect problematic navigation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Detect and prevent navigation to problematic path
            (function() {
              console.log("DIAGNOSTIC: Initializing navigation interception");
              
              // Check if we're on the problematic URL and log details
              if (window.location.pathname.includes('/dashboards/analytics')) {
                console.log("DIAGNOSTIC: Detected problematic URL");
                console.log("DIAGNOSTIC: Document referrer:", document.referrer);
                
                // Log localStorage details
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  console.log("DIAGNOSTIC: localStorage key:", key);
                }
                
                // Redirect to home after logging details
                window.location.href = '/';
              }
              
              // Monitor future navigation attempts
              const originalPushState = history.pushState;
              const originalReplaceState = history.replaceState;
              
              history.pushState = function() {
                if (arguments[2] && arguments[2].includes('/dashboards/analytics')) {
                  console.log("DIAGNOSTIC: Intercepted pushState to problematic URL");
                  console.log("DIAGNOSTIC: Stack trace:", new Error().stack);
                  
                  // Prevent the navigation by redirecting to home
                  arguments[2] = '/';
                }
                return originalPushState.apply(this, arguments);
              };
              
              history.replaceState = function() {
                if (arguments[2] && arguments[2].includes('/dashboards/analytics')) {
                  console.log("DIAGNOSTIC: Intercepted replaceState to problematic URL");
                  console.log("DIAGNOSTIC: Stack trace:", new Error().stack);
                  
                  // Prevent the navigation by redirecting to home
                  arguments[2] = '/';
                }
                return originalReplaceState.apply(this, arguments);
              };
            })();
          `,
          }}
        />
        {/* Add script for sidebar state management */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              // Initialize sidebar state from localStorage or default to open
              window.sidebarOpen = localStorage.getItem('sidebarOpen') !== 'false';
              
              document.documentElement.classList.toggle('sidebar-open', window.sidebarOpen);
              
              window.addEventListener('DOMContentLoaded', () => {
                const toggleBtn = document.querySelector('[data-toggle-sidebar]');
                if (toggleBtn) {
                  toggleBtn.addEventListener('click', () => {
                    window.sidebarOpen = !window.sidebarOpen;
                    localStorage.setItem('sidebarOpen', window.sidebarOpen);
                    document.documentElement.classList.toggle('sidebar-open', window.sidebarOpen);
                  });
                }
              });
            })();
          `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html.sidebar-open .main-content {
              padding-left: 16rem; /* 64px */
              transition: padding-left 0.3s ease-in-out;
            }
            html:not(.sidebar-open) .main-content {
              padding-left: 0;
              transition: padding-left 0.3s ease-in-out;
            }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>
            {/* Client component handles the path check */}
            <RouteAwareControls />

            {/* Global navigation */}
            {/* <FloatingNav navItems={navItems} /> */}

            {/* Sidebar is included globally */}
            {/* <Sidebar /> */}

            {/* Main content area that adjusts based on sidebar state */}
            <main className="min-h-screen bg-background main-content">
              {children}
            </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
