"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Home, Building2, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { BookingMethodData } from "../booking.types";

interface StepBookingMethodProps {
  form: UseFormReturn<BookingMethodData>;
}

const bookingMethods = [
  {
    id: "home-collection",
    title: "Home Collection",
    description: "Sample collected from your doorstep",
    icon: Home,
    features: ["Convenient & Safe", "Trained Phlebotomist", "No Extra Charge*"],
    color: "blue",
  },
  {
    id: "lab-visit",
    title: "Visit Lab",
    description: "Walk-in to our nearest lab center",
    icon: Building2,
    features: ["Immediate Service", "Multiple Locations", "No Appointment"],
    color: "green",
  },
  {
    id: "slot-booking",
    title: "Book a Slot",
    description: "Reserve your time at the lab",
    icon: Calendar,
    features: ["No Waiting Time", "Priority Service", "Choose Your Time"],
    color: "purple",
  },
] as const;

export function StepBookingMethod({ form }: StepBookingMethodProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          How would you like to get tested?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Choose the most convenient option for you
        </p>
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {bookingMethods.map((method, index) => {
                    const Icon = method.icon;
                    const isSelected = field.value === method.id;

                    return (
                      <motion.div
                        key={method.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => field.onChange(method.id)}
                        className={cn(
                          "relative cursor-pointer rounded-xl border-2 p-4 sm:p-6 transition-all duration-300",
                          "hover:shadow-lg hover:scale-[1.02]",
                          isSelected
                            ? method.color === "blue"
                              ? "border-blue-500 bg-blue-50 shadow-blue-100"
                              : method.color === "green"
                              ? "border-green-500 bg-green-50 shadow-green-100"
                              : "border-purple-500 bg-purple-50 shadow-purple-100"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                      >
                        {/* Selection Indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                          >
                            <CheckCircle2
                              className={cn(
                                "w-6 h-6",
                                method.color === "blue"
                                  ? "text-blue-500"
                                  : method.color === "green"
                                  ? "text-green-500"
                                  : "text-purple-500"
                              )}
                            />
                          </motion.div>
                        )}

                        {/* Icon */}
                        <div
                          className={cn(
                            "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4",
                            method.color === "blue"
                              ? "bg-blue-100"
                              : method.color === "green"
                              ? "bg-green-100"
                              : "bg-purple-100"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-6 h-6 sm:w-7 sm:h-7",
                              method.color === "blue"
                                ? "text-blue-600"
                                : method.color === "green"
                                ? "text-green-600"
                                : "text-purple-600"
                            )}
                          />
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {method.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {method.description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-2">
                          {method.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage className="text-center mt-4" />
            </FormItem>
          )}
        />
      </Form>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6"
      >
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Home collection is available between 6 AM - 6 PM.
          For urgent tests, please visit our lab directly.
        </p>
      </motion.div>
    </div>
  );
}
