"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { X, LogOut, FlaskConical } from "lucide-react";
import { useAuth, ROLE_LABELS } from "@/lib/auth";

export type SidebarItem = {
  label: string;
  icon?: React.ReactNode;
  href: string;
};

type EmployeeSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  items: SidebarItem[];
};

export default function EmployeeSidebar({ isOpen, onClose, items }: EmployeeSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLinkClick = (href: string) => {
    router.push(href);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== "/employee-portal" && pathname.startsWith(href + "/"));
  };

  return (
    <>
      {/* Overlay (mobile only) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        exit={{ x: -280 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="fixed top-0 left-0 lg:static z-50 w-72 h-screen lg:h-full min-h-screen bg-emerald-700 text-white flex flex-col overflow-hidden"
      >
        {/* Close Button (mobile only) */}
        <div className="lg:hidden flex justify-end p-4 border-b border-white/20">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header / Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/20">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Employee Portal</h2>
            <p className="text-xs text-white/70">Ekta Janch Kendra</p>
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/20">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{user?.name || "Guest"}</h4>
            <p className="text-xs text-white/70 truncate">
              {user?.role ? ROLE_LABELS[user.role] : "Unknown"}
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {items.map((item) => {
            const itemActive = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                className={`w-full flex items-center gap-3 px-6 py-3.5 transition duration-200 ${
                  itemActive
                    ? "bg-white/20 border-r-4 border-white"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="shrink-0 opacity-90">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/20 px-4 py-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition duration-200 mb-3"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
          <p className="text-xs opacity-60 text-center">© 2026 Ekta Janch Kendra</p>
        </div>
      </motion.aside>
    </>
  );
}
