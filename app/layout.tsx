import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/Toaster";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import ServiceWorkerUpdatePrompt from "@/components/pwa/ServiceWorkerUpdatePrompt";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "MGP Loyalty Program System",
  description: "Customer rewards management platform for Mangatrai Pearls & Jewellers",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MGP Loyalty",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
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
          <ServiceWorkerRegistration />
          {user ? (
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar 
                  userEmail={user.email} 
                  userRole={user.role}
                />
                <main className="flex-1 lg:ml-64 pt-0 lg:pt-0 px-3 sm:px-4 lg:px-8 pb-20 lg:pb-4">
                  {children}
                </main>
                <BottomNav />
                <PWAInstallPrompt />
                <ServiceWorkerUpdatePrompt />
              </div>
            </SidebarProvider>
          ) : (
            <main>{children}</main>
          )}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}

