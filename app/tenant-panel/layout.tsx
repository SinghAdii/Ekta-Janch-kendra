"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { sidebarItems } from "@/components/custom/tenant-panel/tenant.data";
import { Sidebar } from "@/components/custom/tenant-panel/tenant.components.js";
import { QueryProvider } from "@/providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <QueryProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          items={sidebarItems}
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
