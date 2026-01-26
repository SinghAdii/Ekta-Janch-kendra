"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Download,
  Share2,
  IndianRupee,
  TestTube,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CompleteBookingData } from "../booking.types";
import {
  getTestById,
  getPackageById,
  formatDate,
  calculateGrandTotal,
} from "../booking.data";
import Link from "next/link";

interface BookingSuccessProps {
  bookingId: string | null;
  formData: CompleteBookingData;
  onNewBooking: () => void;
}

export function BookingSuccess({
  bookingId,
  formData,
  onNewBooking,
}: BookingSuccessProps) {
  const selectedTestDetails = formData.tests
    ?.map((id) => getTestById(id))
    .filter(Boolean);
  const selectedPackageDetails = formData.packages
    ?.map((id) => getPackageById(id))
    .filter(Boolean);
  const grandTotal = calculateGrandTotal(
    formData.tests || [],
    formData.packages || []
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="text-center mb-8"
        >
          <div className="relative inline-flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: 2,
                repeatType: "loop",
              }}
              className="absolute w-24 h-24 bg-green-200 rounded-full"
            />
            <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600">
              Your test booking has been successfully placed
            </p>
          </motion.div>
        </motion.div>

        {/* Booking ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-linear-to-r from-blue-600 to-blue-700 text-white mb-6 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              
              <div className="relative z-10">
                <p className="text-blue-100 text-sm mb-1">Booking Reference</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-wider mb-4">
                  {bookingId || "Pending..."}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    {formData.method === "home-collection"
                      ? "Home Collection"
                      : formData.method === "slot-booking"
                      ? "Slot Booking"
                      : "Lab Visit"}
                  </Badge>
                  <Badge className="bg-green-400/30 hover:bg-green-400/40 text-white">
                    {formData.payment?.paymentMode === "Cash" ||
                    formData.payment?.paymentMode === "Pay Later"
                      ? "Pay at Collection"
                      : "Paid Online"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Booking Details
              </h3>

              {/* Patient Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="font-medium text-gray-900">
                      {formData.patient?.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="font-medium text-gray-900">
                      +91 {formData.patient?.mobile}
                    </p>
                  </div>
                </div>
                {formData.patient?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {formData.patient.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Appointment Info */}
              {formData.method === "home-collection" && formData.homeCollection && (
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Collection Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(formData.homeCollection.preferredDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Time Slot</p>
                      <p className="font-medium text-gray-900">
                        {formData.homeCollection.preferredTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Collection Address</p>
                      <p className="font-medium text-gray-900">
                        {formData.homeCollection.address}
                        {formData.homeCollection.landmark &&
                          `, ${formData.homeCollection.landmark}`}
                        <br />
                        {formData.homeCollection.city} -{" "}
                        {formData.homeCollection.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(formData.method === "lab-visit" ||
                formData.method === "slot-booking") &&
                formData.labVisit && (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Appointment Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(formData.labVisit.preferredDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Time Slot</p>
                        <p className="font-medium text-gray-900">
                          {formData.labVisit.preferredTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              <Separator className="my-4" />

              {/* Tests & Packages */}
              <div className="space-y-4">
                {selectedTestDetails && selectedTestDetails.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                      <TestTube className="w-4 h-4" />
                      Tests ({selectedTestDetails.length})
                    </p>
                    <div className="space-y-2">
                      {selectedTestDetails.map((test) => (
                        <div
                          key={test?.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">{test?.name}</span>
                          <span className="font-medium flex items-center">
                            <IndianRupee className="w-3 h-3" />
                            {test?.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPackageDetails && selectedPackageDetails.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Packages ({selectedPackageDetails.length})
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
                            <span className="text-gray-700">{pkg?.name}</span>
                            <span className="font-medium flex items-center">
                              <IndianRupee className="w-3 h-3" />
                              {Math.round(discountedPrice)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Separator className="my-2" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-blue-600 flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {Math.round(grandTotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Download receipt logic
                alert("Receipt download feature coming soon!");
              }}
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Share booking details
                if (navigator.share) {
                  navigator.share({
                    title: "Ekta Janch Kendra - Booking Confirmation",
                    text: `Booking ID: ${bookingId}`,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          <Button
            onClick={onNewBooking}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Book Another Test
          </Button>

          <Link href="/pages" className="block">
            <Button variant="ghost" className="w-full">
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Preparation Tips:</strong>
            </p>
            <ul className="text-sm text-amber-700 mt-2 space-y-1">
              <li>• Maintain fasting for 10-12 hours if required</li>
              <li>• Stay hydrated (water is allowed during fasting)</li>
              <li>• Keep your ID proof ready for verification</li>
            </ul>
          </div>

          <p className="text-gray-500 text-sm mt-4">
            For any queries, contact us at{" "}
            <a href="tel:+911234567890" className="text-blue-600 font-medium">
              +91 12345 67890
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
