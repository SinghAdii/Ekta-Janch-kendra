"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Loader2 } from "lucide-react";
import { sidebarItems } from "@/components/custom/tenant-panel/tenant.data";
import { Sidebar } from "@/components/custom/tenant-panel/tenant.components.js";
import { QueryProvider } from "@/providers";
import { useAuth, hasRoutePermission, filterSidebarItems } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filter sidebar items based on user role
  const filteredSidebarItems = useMemo(() => {
    if (!user) return [];
    return filterSidebarItems(sidebarItems, user.role);
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Check route permissions and redirect if unauthorized
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const hasPermission = hasRoutePermission(user.role, pathname);
      if (!hasPermission) {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check route permission
  if (!hasRoutePermission(user.role, pathname)) {
    return null;
  }

  return (
    <QueryProvider>
      <div className="flex h-screen">
        {/* Sidebar with filtered items */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          items={filteredSidebarItems}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen bg-gray-50 lg:bg-gray-100 overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
            <h1 className="font-semibold text-lg text-gray-900">Ekta Janch Kendra</h1>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </QueryProvider>
  );
}
