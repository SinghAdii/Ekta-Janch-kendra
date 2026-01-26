"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import React from "react";

export interface HeroSlide {
  id: string | number;
  image: string;
  heading?: React.ReactNode | string;
  title?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    link: string;
  };
  secondaryCTA?: {
    text: string;
    link: string;
  };
  enableOverlay?: boolean;
}

interface HerosectionProps {
  slides: HeroSlide[];
  placeholderText?: string;
  autoPlayInterval?: number;
}

export default function Herosection({
  slides,
  autoPlayInterval = 5000,
  placeholderText = "Pathology & Laboratory Tests | Radiology & Imaging | Health Checkup Packages | Specialty Diagnostics | Corporate & Pre-Employm",
}: HerosectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isHovered, autoPlayInterval, nextSlide]);

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="w-full mt-22 mb-22">
      {/* HERO */}
      <div
        className="relative h-[80vh] min-h-150 w-full overflow-hidden bg-black"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Background */}
            <div className="relative h-full w-full">
              <Image
                src={slides[currentIndex].image}
                alt={slides[currentIndex].title || "Hero Image"}
                fill
                className="object-cover"
                priority
              />
              {slides[currentIndex].enableOverlay && (
                <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent" />
              )}
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20">
              <div className="max-w-4xl">
                <>
                  {slides[currentIndex].title && (
                    <motion.span
                      custom={0}
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-4 inline-block rounded-full bg-primary/90 px-4 py-1.5 text-sm font-semibold uppercase text-white"
                    >
                      {slides[currentIndex].title}
                    </motion.span>
                  )}

                  {slides[currentIndex].heading && (
                    <motion.h1
                      custom={1}
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className={`text-5xl capitalize max-w-3xl font-inter leading-tight text-black md:text-6xl lg:text-8xl ${
                        slides[currentIndex].enableOverlay
                          ? "text-gray-700 font-semibold"
                          : "text-black font-medium"
                      }`}
                    >
                      {slides[currentIndex].heading}
                    </motion.h1>
                  )}

                  {slides[currentIndex].description && (
                    <motion.p
                      custom={2}
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className={`mb-8 max-w-2xl font-inter text-md ${
                        slides[currentIndex].enableOverlay
                          ? "text-gray-700/70 font-semibold"
                          : "text-black font-medium"
                      } capitalize md:text-lg lg:text-xl`}
                    >
                      {slides[currentIndex].description}
                    </motion.p>
                  )}

                  {(slides[currentIndex].primaryCTA ||
                    slides[currentIndex].secondaryCTA) && (
                    <motion.div
                      custom={3}
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex gap-5 flex-wrap mt-10"
                    >
                      {slides[currentIndex].primaryCTA && (
                        <Link href={slides[currentIndex].primaryCTA.link}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white hover:bg-primary/90 hover:cursor-pointer"
                          >
                            {slides[currentIndex].primaryCTA.text}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </Link>
                      )}
                      {slides[currentIndex].secondaryCTA && (
                        <Link href={slides[currentIndex].secondaryCTA.link}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group inline-flex items-center gap-2 rounded-lg bg-transparent border border-primary px-8 py-4 text-lg font-semibold text-primary hover:cursor-pointer"
                          >
                            {slides[currentIndex].secondaryCTA.text}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </Link>
                      )}
                    </motion.div>
                  )}
                </>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-3 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-3 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        {/* Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-3 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Placeholder Bar */}
      {placeholderText && (
        <div className="w-full bg-primary py-2 px-4 text-white">
          <p className="text-center font-semibold capitalize">
            {placeholderText}
          </p>
        </div>
      )}
    </section>
  );
}
