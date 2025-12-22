"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import React from "react"; // Import React for React.ReactNode

export interface HeroSlide {
    id: string | number;
    image: string;
    heading?: string;
    title?: string;
    description?: string;
    cta?: {
        text: string;
        link: string;
    };
    content?: React.ReactNode;
    enableOverlay?: boolean;
}

interface HerosectionProps {
    slides: HeroSlide[];
    autoPlayInterval?: number;
}

export default function Herosection({
    slides,
    autoPlayInterval = 5000,
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
        const interval = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);
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
        <div
            className="relative h-[80vh] min-h-150 w-full overflow-hidden bg-black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                <motion.div
                    key={currentIndex}
                    className="absolute inset-0 h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Background Image */}
                    <div className="relative h-full w-full">
                        <Image
                            src={slides[currentIndex].image}
                            alt={slides[currentIndex].heading || "Hero Image"}
                            fill
                            className="object-cover"
                            priority
                        />
                        {slides[currentIndex].enableOverlay && (
                            <div className="absolute inset-0 bg-black/30" />
                        )}
                    </div>
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-start px-6 md:px-12 lg:px-20">
                        <div className="max-w-4xl text-left">
                            {slides[currentIndex].content ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    {slides[currentIndex].content}
                                </motion.div>
                            ) : (
                                <>
                                    {slides[currentIndex].title && (
                                        <motion.span
                                            custom={0}
                                            variants={contentVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="mb-4 inline-block rounded-full bg-primary/90 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-white"
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
                                            className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
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
                                            className="mb-8 max-w-2xl text-lg text-gray-200 md:text-xl lg:text-2xl"
                                        >
                                            {slides[currentIndex].description}
                                        </motion.p>
                                    )}

                                    {slides[currentIndex].cta && (
                                        <motion.div
                                            custom={3}
                                            variants={contentVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <Link href={slides[currentIndex].cta.link}>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary/90"
                                                >
                                                    {slides[currentIndex].cta.text}
                                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </motion.button>
                                            </Link>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:left-8"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-8 w-8" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 md:right-8"
                aria-label="Next slide"
            >
                <ChevronRight className="h-8 w-8" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-3 rounded-full transition-all ${index === currentIndex ? "w-8 bg-primary" : "w-3 bg-white/50 hover:bg-white"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
