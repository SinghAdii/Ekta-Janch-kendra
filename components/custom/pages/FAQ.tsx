"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  title?: string;
  items: FAQItem[];
};

export default function FAQ({
  title = "Frequently Asked Questions (FAQ’s)",
  items,
}: FAQProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-5xl mx-auto px-4">
      <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b">
          <h2 className="text-2xl font-semibold text-primary capitalize">
            {title}
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="divide-y">
          {items.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div key={index}>
                <button
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {item.question}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl text-gray-500"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
