import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/Toaster";
import Sidebar from "@/components/layout/Sidebar";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "MGP Loyalty Program System",
  description: "Customer rewards management platform for Mangatrai Pearls & Jewellers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get current user if authenticated
  // If user exists, middleware has already ensured we're not on an auth page
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          {user ? (
            <div className="flex min-h-screen">
              <Sidebar 
                userEmail={user.email} 
                userRole={user.role}
              />
              <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                {children}
              </main>
            </div>
          ) : (
            <main>{children}</main>
          )}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}

