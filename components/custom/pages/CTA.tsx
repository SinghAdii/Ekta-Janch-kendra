"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";


export default function CTA() {
  const navigate = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center bg-[linear-gradient(100deg,#1B6387_20%,#8FDAFF)] py-12 px-6 rounded-2xl my-10 justify-between max-w-5xl mx-auto gap-6 md:gap-0 shadow-md"
    >
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-white font-inter font-bold text-3xl md:text-4xl">
          Ready To Get Started?
        </h1>
        <p className="text-white font-inter font-light text-base md:text-lg mt-2">
          fill out the form below to book your appointment
        </p>
      </div>
      <div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate.push('/pages/booking')}
          className="px-6 py-3 bg-white text-black text-center font-inter font-bold rounded-2xl cursor-pointer shadow-md"
        >
          Book Your Appointment
        </motion.button>
      </div>
    </motion.div>
  );
}
