"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Calendar, Clock, Building2, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LabVisitData } from "../booking.types";
import { labLocations, timeSlots, getAvailableDates, formatDate } from "../booking.data";

interface StepLabVisitProps {
  form: UseFormReturn<LabVisitData>;
}

export function StepLabVisit({ form }: StepLabVisitProps) {
  const availableDates = getAvailableDates();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Schedule Your Lab Visit
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Select your preferred lab location and time slot
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Lab Location Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="labLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Select Lab Location
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {labLocations.map((location, index) => {
                        const isSelected = field.value === location.id;
                        return (
                          <motion.div
                            key={location.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            onClick={() => field.onChange(location.id)}
                            className={cn(
                              "relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                            )}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3"
                              >
                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                              </motion.div>
                            )}

                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-blue-600" />
                            </div>

                            <div className="flex-1 min-w-0 pr-8">
                              <h4 className="font-semibold text-gray-900">
                                {location.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {location.address}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose a date" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {formatDate(date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Time Slot Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Select Time Slot <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                      {timeSlots.map((slot, index) => {
                        const isSelected = field.value === slot.time;
                        const isDisabled = !slot.available;

                        return (
                          <motion.button
                            key={slot.id}
                            type="button"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && field.onChange(slot.time)}
                            className={cn(
                              "relative p-3 rounded-lg border-2 text-sm font-medium transition-all",
                              isSelected
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : isDisabled
                                ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                                : "border-gray-200 hover:border-blue-200 hover:bg-gray-50 text-gray-700"
                            )}
                          >
                            {slot.time}
                            {isDisabled && (
                              <Badge
                                variant="secondary"
                                className="absolute -top-2 -right-2 text-[10px] px-1"
                              >
                                Booked
                              </Badge>
                            )}
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500 absolute top-1 right-1" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </form>
      </Form>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Priority Service:</strong> By booking a slot, you&apos;ll get
            priority service with minimal waiting time at the lab.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>What to Bring:</strong>
          </p>
          <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
            <li>Valid ID proof (Aadhar/PAN/Driving License)</li>
            <li>Doctor&apos;s prescription (if applicable)</li>
            <li>Previous reports (if any)</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
