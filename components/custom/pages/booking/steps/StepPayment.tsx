"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import {
  CreditCard,
  Wallet,
  Building,
  Smartphone,
  Clock,
  IndianRupee,
  Tag,
  CheckCircle2,
  TestTube,
  Home,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookingMethod, PaymentData } from "../booking.types";
import {
  calculateTestsTotal,
  calculatePackagesTotal,
  getTestById,
  getPackageById,
} from "../booking.data";

interface StepPaymentProps {
  form: UseFormReturn<PaymentData>;
  selectedTests: string[];
  selectedPackages: string[];
  bookingMethod?: BookingMethod;
}

const paymentMethods = [
  {
    id: "UPI",
    name: "UPI",
    description: "GPay, PhonePe, Paytm",
    icon: Smartphone,
    color: "purple",
  },
  {
    id: "Card",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, RuPay",
    icon: CreditCard,
    color: "blue",
  },
  {
    id: "NetBanking",
    name: "Net Banking",
    description: "All major banks",
    icon: Building,
    color: "green",
  },
  {
    id: "Cash",
    name: "Pay at Collection",
    description: "Cash/Card at time of sample collection",
    icon: Wallet,
    color: "amber",
  },
  {
    id: "Pay Later",
    name: "Pay Later",
    description: "Pay after receiving report",
    icon: Clock,
    color: "gray",
  },
] as const;

export function StepPayment({
  form,
  selectedTests,
  selectedPackages,
  bookingMethod,
}: StepPaymentProps) {
  // Calculate totals
  const testsTotal = calculateTestsTotal(selectedTests);
  const packagesTotal = calculatePackagesTotal(selectedPackages);
  const subtotal = testsTotal + packagesTotal;
  
  // Home collection fee (optional - can be free)
  const homeCollectionFee = 0; // Free home collection
  
  // Calculate discount (if any coupon applied)
  const discount = 0;
  
  // Grand total
  const grandTotal = subtotal + homeCollectionFee - discount;

  // Get selected items details
  const selectedTestDetails = selectedTests.map((id) => getTestById(id)).filter(Boolean);
  const selectedPackageDetails = selectedPackages.map((id) => getPackageById(id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Review & Payment
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Review your booking and select payment method
        </p>
      </div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 rounded-lg p-4"
      >
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TestTube className="w-5 h-5 text-blue-600" />
          Booking Summary
        </h3>

        {/* Booking Type */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="flex items-center gap-1">
            {bookingMethod === "home-collection" ? (
              <Home className="w-3 h-3" />
            ) : (
              <Calendar className="w-3 h-3" />
            )}
            {bookingMethod === "home-collection"
              ? "Home Collection"
              : bookingMethod === "slot-booking"
              ? "Slot Booking"
              : "Lab Visit"}
          </Badge>
        </div>

        {/* Selected Tests */}
        {selectedTestDetails.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Tests ({selectedTestDetails.length}):
            </p>
            <div className="space-y-2">
              {selectedTestDetails.map((test) => (
                <div
                  key={test?.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">{test?.name}</span>
                  <span className="font-medium flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {test?.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Packages */}
        {selectedPackageDetails.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Packages ({selectedPackageDetails.length}):
            </p>
            <div className="space-y-2">
              {selectedPackageDetails.map((pkg) => {
                const discountedPrice = pkg?.discount
                  ? pkg.price - (pkg.price * pkg.discount) / 100
                  : pkg?.price || 0;
                return (
                  <div
                    key={pkg?.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{pkg?.name}</span>
                      {pkg?.discount && (
                        <Badge className="bg-green-100 text-green-700 text-[10px]">
                          {pkg.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      {pkg?.discount && (
                        <span className="text-xs text-gray-400 line-through mr-2 inline-flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {pkg.price}
                        </span>
                      )}
                      <span className="font-medium inline-flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {Math.round(discountedPrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Separator className="my-3" />

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="flex items-center">
              <IndianRupee className="w-3 h-3" />
              {Math.round(subtotal)}
            </span>
          </div>
          {bookingMethod === "home-collection" && (
            <div className="flex justify-between">
              <span className="text-gray-600">Home Collection Fee</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="flex items-center">
                - <IndianRupee className="w-3 h-3" />
                {discount}
              </span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-blue-600 flex items-center">
              <IndianRupee className="w-4 h-4" />
              {Math.round(grandTotal)}
            </span>
          </div>
        </div>
      </motion.div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Coupon Code */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="couponCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Have a Coupon Code?
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        className="h-11 uppercase"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                      <Button type="button" variant="outline" className="h-11">
                        Apply
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Payment Method Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="paymentMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Select Payment Method <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {paymentMethods.map((method, index) => {
                        const Icon = method.icon;
                        const isSelected = field.value === method.id;

                        return (
                          <motion.div
                            key={method.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            onClick={() => field.onChange(method.id)}
                            className={cn(
                              "relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                            )}
                          >
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-blue-500 absolute top-2 right-2" />
                            )}

                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                method.color === "purple"
                                  ? "bg-purple-100"
                                  : method.color === "blue"
                                  ? "bg-blue-100"
                                  : method.color === "green"
                                  ? "bg-green-100"
                                  : method.color === "amber"
                                  ? "bg-amber-100"
                                  : "bg-gray-100"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "w-5 h-5",
                                  method.color === "purple"
                                    ? "text-purple-600"
                                    : method.color === "blue"
                                    ? "text-blue-600"
                                    : method.color === "green"
                                    ? "text-green-600"
                                    : method.color === "amber"
                                    ? "text-amber-600"
                                    : "text-gray-600"
                                )}
                              />
                            </div>

                            <div className="flex-1 pr-6">
                              <p className="font-medium text-gray-900 text-sm">
                                {method.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {method.description}
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

          {/* Terms & Conditions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </a>
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </motion.div>
        </form>
      </Form>

      {/* Secure Payment Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 text-sm text-gray-500"
      >
        <svg
          className="w-4 h-4 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        100% Secure Payment | SSL Encrypted
      </motion.div>
    </div>
  );
}
