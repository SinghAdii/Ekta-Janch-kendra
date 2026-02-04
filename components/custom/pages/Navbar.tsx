"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown, Search, XCircle, CalendarCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { Button } from "@/components/ui/button";

const routes = [
  {
    name: "Home",
    path: "/pages",
  },
  {
    name: "Test Booking",
    path: "/pages/test-booking",
  },
  {
    name: "Packages",
    path: "/pages/packages",
  },
  {
    name: "Reports",
    path: "/pages/reports",
  },
  {
    name: "Doctor Collaboration",
    path: "/pages/doctor-collaboration",
  },
  {
    name: "Contact Us",
    path: "/pages/contact-us",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isManageDropdownOpen, setIsManageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsManageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-primary shadow-md">
      <div className="flex h-24 w-full items-center justify-between px-6">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/">
            <Image
              src="/assets/images/ekta-logo.png"
              alt="Logo"
              width={128}
              height={96}
              className="h-24 w-32 object-contain"
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 text-base font-semibold text-center text-white lg:flex">
          {routes.map((route) => (
            <motion.div
              key={route.name}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={route.path}
                className="rounded px-3 py-2 transition-colors hover:bg-white hover:text-primary"
              >
                {route.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Side Buttons (Desktop) */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* Book Now Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/pages/booking">
              <Button className="bg-white text-primary hover:bg-gray-100 font-semibold px-6">
                <CalendarCheck className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </Link>
          </motion.div>

          {/* Manage Orders Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary font-semibold px-6"
                onClick={() => setIsManageDropdownOpen(!isManageDropdownOpen)}
                onMouseEnter={() => setIsManageDropdownOpen(true)}
              >
                Manage Orders
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                    isManageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </motion.div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isManageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border overflow-hidden z-50"
                  onMouseLeave={() => setIsManageDropdownOpen(false)}
                >
                  <Link
                    href="/pages/track-order"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsManageDropdownOpen(false)}
                  >
                    <Search className="w-4 h-4" />
                    <span className="font-medium">Track Order</span>
                  </Link>
                  <Link
                    href="/pages/cancel-order"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t"
                    onClick={() => setIsManageDropdownOpen(false)}
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="font-medium">Cancel Order</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden text-white">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="z-50 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 top-0 z-40 flex flex-col bg-primary pt-28 text-white lg:hidden"
          >
            <div className="flex flex-col items-center gap-8 text-xl font-semibold">
              {routes.map((route) => (
                <motion.div key={route.name} variants={itemVariants}>
                  <Link
                    href={route.path}
                    onClick={toggleMenu}
                    className="block px-4 py-2 hover:text-gray-200"
                  >
                    {route.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="h-px w-1/2 bg-white/20 my-2"
              />

              {/* Mobile Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 w-full px-8">
                <Link href="/pages/booking" onClick={toggleMenu} className="w-full">
                  <Button className="w-full bg-white text-primary hover:bg-gray-100 font-semibold h-12">
                    <CalendarCheck className="w-5 h-5 mr-2" />
                    Book Now
                  </Button>
                </Link>
                
                <div className="text-center text-lg font-medium text-white/80">
                  Manage Orders
                </div>
                
                <div className="flex gap-4 w-full">
                  <Link href="/pages/track-order" onClick={toggleMenu} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-white text-white hover:bg-white hover:text-primary font-medium h-12"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                  </Link>
                  <Link href="/pages/cancel-order" onClick={toggleMenu} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-white text-white hover:bg-white hover:text-red-600 font-medium h-12"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
