import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/Toaster";
import Navbar from "@/components/layout/Navbar";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "MGP Loyalty Program System",
  description: "Customer rewards management platform for Mangatrai Pearls & Jewellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}

