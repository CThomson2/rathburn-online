import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { MobileNavbar } from "@/components/mobile/navbar";
import { MobileFooter } from "@/components/mobile/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventory Scanner - Mobile",
  description: "Mobile interface for inventory management and barcode scanning",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "flex min-h-full flex-col bg-background antialiased",
          inter.className
        )}
      >
        <MobileNavbar />
        <main className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
          {children}
        </main>
        <MobileFooter />
      </body>
    </html>
  );
}
