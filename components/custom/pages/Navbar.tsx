"use client";

import Image from "next/image";
import Link from "next/link";
import { LucideClipboardCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";

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

  const toggleMenu = () => setIsOpen(!isOpen);

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

        {/* Right Side Icons (Desktop) */}
        <div className="hidden items-center gap-6 text-white lg:flex">
          <motion.div whileHover={{ rotate: 15 }}>
            <LucideClipboardCheck className="h-6 w-6 cursor-pointer" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Image
              src="/assets/images/user.png"
              alt="Profile"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-white"
            />
          </motion.div>
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

              <motion.div variants={itemVariants} className="flex gap-6">
                <LucideClipboardCheck className="h-8 w-8" />
                <Image
                  src="/assets/images/user.png"
                  alt="Profile"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full border-2 border-white"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
