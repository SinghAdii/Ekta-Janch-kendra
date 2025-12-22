"use client"

import { Herosection, Navbar } from "@/components/custom/pages/pages.components.js";

import Link from "next/link";
import { motion, Variants } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <Navbar />
            <Herosection slides={[
                {
                    id: 1,
                    image: "/assets/images/hero-bg-home.png",
                    content: <HeroContent primaryCTA={{ text: "Book a Test Now", link: "/about" }} secondaryCTA={{ text: "View More", link: "/about" }}
                        keyword="Diagnostics,"
                        firstDesc="Trusted "
                        lastDesc="Reliable Results"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
                },
                {
                    id: 2,
                    image: "/assets/images/hero-bg-2.png",
                    content: <HeroContent primaryCTA={{ text: "Get Started", link: "/about" }} secondaryCTA={{ text: "Read More", link: "/about" }} heading="Trusted Diagnostics, Reliable Results" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />,

                },
            ]} />
        </div>
    );
}


export interface HeroContentProps {
    heading?: string;
    description?: string;
    keyword?: string;
    firstDesc?: string;
    lastDesc?: string;
    primaryCTA?: {
        text: string;
        link: string;
    };
    secondaryCTA?: {
        text: string;
        link: string;
    };
}

export function HeroContent({
    keyword,
    firstDesc,
    lastDesc,
    heading,
    description,
    primaryCTA,
    secondaryCTA,
}: HeroContentProps) {
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
        <div className="flex flex-col items-start">


            {/* this is the heading */}
            <motion.h1
                custom={1}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="mb-4"
            >
                <div className="">
                    {keyword && <h1 className="text-5xl font-inter font-medium leading-tight text-black md:text-6xl lg:text-8xl">
                        {firstDesc}
                        <span className="text-primary block">{keyword}</span>
                        {lastDesc}
                    </h1>}
                    {!keyword && <h1 className="text-5xl max-w-3xl font-inter font-medium leading-tight text-black md:text-6xl lg:text-8xl">
                        {heading}
                    </h1>}
                </div>
            </motion.h1>

            {/* this is the description */}
            <motion.div
                custom={2}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="mb-8 max-w-2xl font-inter text-md text-black-200 font-medium capitalize md:text-lg lg:text-xl"
            >
                <p>{description}</p>
            </motion.div>

            <div className="flex gap-4">
                {primaryCTA && (
                    <motion.div
                        custom={3}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Link href={primaryCTA.link}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group inline-flex items-center gap-2 bg-primary px-8 py-2 text-lg font-semibold text-white transition-all hover:bg-primary/90 cursor-pointer"
                            >
                                {primaryCTA.text}
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
                {secondaryCTA && (
                    <motion.div
                        custom={3}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Link href={secondaryCTA.link}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group inline-flex items-center gap-2 border border-primary text-primary px-8 py-2 text-lg font-semibold transition-all hover:cursor-pointer"
                            >
                                {secondaryCTA.text}
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
