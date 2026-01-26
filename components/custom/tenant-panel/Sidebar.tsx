"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import { avatar1 } from "@/assets/images.export";

export type SidebarItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  items: SidebarItem[];
};

export default function Sidebar({ isOpen, onClose, items }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLinkClick = (href?: string) => {
    if (href) {
      router.push(href);
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const hasActiveChild = (children?: SidebarItem["children"]) => {
    if (!children) return false;
    return children.some((child) => isActive(child.href));
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
        className="fixed top-0 left-0 lg:static z-50 w-72 h-screen lg:h-full min-h-screen bg-primary text-white flex flex-col overflow-hidden"
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

            {/* Profile */}
            <div className="flex flex-col items-center py-6 lg:py-8 border-b border-white/20 px-4">
              <Image
                src={avatar1}
                alt="User"
                width={64}
                height={64}
                className="rounded-full mb-3 object-cover"
              />
              <h4 className="font-semibold text-center text-white">Jennifer Arter</h4>
              <p className="text-xs lg:text-sm opacity-80 text-center">Tenant Manager</p>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto mt-4 pb-4">
              {items.map((item) => {
                const isOpenSub = openMenu === item.label;
                const hasActive = hasActiveChild(item.children);
                const itemActive = isActive(item.href);

                return (
                  <div key={item.label}>
                    {/* Parent Menu Item */}
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className={`w-full flex items-center justify-between px-6 py-3 lg:py-4 transition duration-200 group ${
                          itemActive
                            ? "bg-white/20 border-r-4 border-white"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 opacity-90 group-hover:opacity-100">
                            {item.icon}
                          </span>
                          <span className="text-sm font-medium truncate">
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          item.children
                            ? setOpenMenu(isOpenSub ? null : item.label)
                            : null
                        }
                        className={`w-full flex items-center justify-between px-6 py-3 lg:py-4 transition duration-200 group ${
                          hasActive
                            ? "bg-white/20 border-r-4 border-white"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 opacity-90 group-hover:opacity-100">
                            {item.icon}
                          </span>
                          <span className="text-sm font-medium truncate">
                            {item.label}
                          </span>
                        </div>

                        {item.children && (
                          <motion.span
                            animate={{
                              rotate: isOpenSub ? 90 : 0,
                            }}
                            className="shrink-0 opacity-70"
                          >
                            <ChevronRight size={16} />
                          </motion.span>
                        )}
                      </button>
                    )}

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.children && isOpenSub && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{ duration: 0.2 }}
                          className="bg-white/5 overflow-hidden"
                        >
                          {item.children.map((sub) => {
                            const subActive = isActive(sub.href);
                            return (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => handleLinkClick(sub.href)}
                                className={`flex items-center gap-3 px-6 lg:px-8 py-2.5 lg:py-3 text-sm transition duration-200 group ${
                                  subActive
                                    ? "bg-white/15 text-white font-medium border-l-2 border-white"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                <span className="w-1 h-1 rounded-full bg-white opacity-60 group-hover:opacity-100" />
                                <span className="truncate">{sub.label}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-white/20 px-6 py-4 text-xs opacity-60">
              <p>© 2026 Ekta Janch Kendra</p>
            </div>
          </motion.aside>
    </>
  );
}
