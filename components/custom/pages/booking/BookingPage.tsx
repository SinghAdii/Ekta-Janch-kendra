"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Home,
  Building2,
  Calendar,
  User,
  TestTube,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Phone,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookingMethod,
  bookingMethodSchema,
  patientDetailsSchema,
  testSelectionSchema,
  homeCollectionSchema,
  labVisitSchema,
  paymentSchema,
  BookingMethodData,
  PatientDetailsData,
  TestSelectionData,
  HomeCollectionData,
  LabVisitData,
  PaymentData,
  CompleteBookingData,
} from "./booking.types";

// Import Step Components
import {
  StepBookingMethod,
  StepPatientDetails,
  StepTestSelection,
  StepHomeCollection,
  StepLabVisit,
  StepPayment,
  StepOTPVerification,
  BookingSuccess,
} from "./steps";

// Step configuration
const getSteps = (method: BookingMethod | null) => {
  const baseSteps = [
    { id: 1, title: "Booking Type", icon: Home },
    { id: 2, title: "Patient Details", icon: User },
    { id: 3, title: "Select Tests", icon: TestTube },
  ];

  if (method === "home-collection") {
    return [
      ...baseSteps,
      { id: 4, title: "Collection Details", icon: Calendar },
      { id: 5, title: "Payment", icon: CreditCard },
      { id: 6, title: "Verify OTP", icon: Phone },
    ];
  }

  return [
    ...baseSteps,
    { id: 4, title: "Lab Visit", icon: Building2 },
    { id: 5, title: "Payment", icon: CreditCard },
    { id: 6, title: "Verify OTP", icon: Phone },
  ];
};

export function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState<Partial<CompleteBookingData>>({
    method: undefined,
    patient: undefined,
    tests: [],
    packages: [],
    homeCollection: undefined,
    labVisit: undefined,
    payment: undefined,
  });

  const steps = getSteps(formData.method || null);
  const totalSteps = steps.length;

  // Step 1: Booking Method Form
  const methodForm = useForm<BookingMethodData>({
    resolver: zodResolver(bookingMethodSchema),
    defaultValues: { method: formData.method },
  });

  // Step 2: Patient Details Form
  const patientForm = useForm<PatientDetailsData>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: formData.patient || {
      fullName: "",
      mobile: "",
      email: "",
      age: 0,
      gender: undefined,
      alternateContact: "",
    },
  });

  // Step 3: Test Selection Form
  const testForm = useForm<TestSelectionData>({
    resolver: zodResolver(testSelectionSchema),
    defaultValues: {
      selectedTests: formData.tests || [],
      selectedPackages: formData.packages || [],
    },
  });

  // Step 4a: Home Collection Form
  const homeCollectionForm = useForm<HomeCollectionData>({
    resolver: zodResolver(homeCollectionSchema),
    defaultValues: formData.homeCollection || {
      address: "",
      landmark: "",
      city: "",
      pincode: "",
      preferredDate: "",
      preferredTime: undefined,
      instructions: "",
    },
  });

  // Step 4b: Lab Visit Form
  const labVisitForm = useForm<LabVisitData>({
    resolver: zodResolver(labVisitSchema),
    defaultValues: formData.labVisit || {
      preferredDate: "",
      preferredTime: "",
      labLocation: "",
    },
  });

  // Step 5: Payment Form
  const paymentForm = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: formData.payment || {
      paymentMode: undefined,
      couponCode: "",
      agreeTerms: false,
    },
  });

  // Handle step navigation
  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await methodForm.trigger();
        if (isValid) {
          const data = methodForm.getValues();
          setFormData((prev) => ({ ...prev, method: data.method }));
        }
        break;
      case 2:
        isValid = await patientForm.trigger();
        if (isValid) {
          const data = patientForm.getValues();
          setFormData((prev) => ({ ...prev, patient: data }));
        }
        break;
      case 3:
        isValid = await testForm.trigger();
        if (isValid) {
          const data = testForm.getValues();
          setFormData((prev) => ({
            ...prev,
            tests: data.selectedTests || [],
            packages: data.selectedPackages || [],
          }));
        }
        break;
      case 4:
        if (formData.method === "home-collection") {
          isValid = await homeCollectionForm.trigger();
          if (isValid) {
            const data = homeCollectionForm.getValues();
            setFormData((prev) => ({ ...prev, homeCollection: data }));
          }
        } else {
          isValid = await labVisitForm.trigger();
          if (isValid) {
            const data = labVisitForm.getValues();
            setFormData((prev) => ({ ...prev, labVisit: data }));
          }
        }
        break;
      case 5:
        isValid = await paymentForm.trigger();
        if (isValid) {
          const data = paymentForm.getValues();
          setFormData((prev) => ({ ...prev, payment: data }));
        }
        break;
      default:
        isValid = true;
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handle OTP verification and booking completion
  // TODO: Integrate with backend API for OTP verification and booking submission
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOTPVerified = async (otpValue: string) => {
    setIsLoading(true);
    
    // Backend integration point:
    // 1. Verify OTP with backend API
    // 2. Submit booking data (formData) to backend
    // 3. Get booking ID from backend response
    // Example:
    // const response = await api.verifyOTPAndCreateBooking({ otp: otpValue, bookingData: formData });
    // if (response.success) {
    //   setBookingId(response.bookingId);
    //   setBookingComplete(true);
    // }
    
    // Placeholder: Set booking complete for UI demonstration
    // Remove this and replace with actual API call
    setBookingId(null); // Will be set from API response
    setBookingComplete(true);
    setIsLoading(false);
  };

  // Reset form for new booking
  const handleNewBooking = () => {
    setCurrentStep(1);
    setBookingComplete(false);
    setBookingId(null);
    setFormData({
      method: undefined,
      patient: undefined,
      tests: [],
      packages: [],
      homeCollection: undefined,
      labVisit: undefined,
      payment: undefined,
    });
    methodForm.reset();
    patientForm.reset();
    testForm.reset();
    homeCollectionForm.reset();
    labVisitForm.reset();
    paymentForm.reset();
  };

  // Get complete form data for submission
  // This can be used by backend integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCompleteFormData = (): CompleteBookingData => {
    return formData as CompleteBookingData;
  };

  // If booking is complete, show success screen
  if (bookingComplete) {
    return (
      <BookingSuccess
        bookingId={bookingId}
        formData={formData as CompleteBookingData}
        onNewBooking={handleNewBooking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Book Your Test
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Complete your booking in a few simple steps
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 hidden sm:block" />
            <div
              className="absolute left-0 top-5 h-0.5 bg-blue-600 transition-all duration-500 hidden sm:block"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            />

            {/* Steps */}
            <div className="flex justify-between w-full relative z-10">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex flex-col items-center",
                      index === 0 && "items-start sm:items-center",
                      index === steps.length - 1 && "items-end sm:items-center"
                    )}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted
                          ? "#16a34a"
                          : isActive
                          ? "#2563eb"
                          : "#e5e7eb",
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                        "shadow-md"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <StepIcon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-white" : "text-gray-500"
                          )}
                        />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        "mt-2 text-xs font-medium hidden sm:block",
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Step Indicator */}
          <div className="mt-4 text-center sm:hidden">
            <span className="text-sm font-medium text-blue-600">
              Step {currentStep} of {totalSteps}: {steps[currentStep - 1]?.title}
            </span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 sm:p-6 lg:p-8"
              >
                {/* Step 1: Booking Method */}
                {currentStep === 1 && (
                  <StepBookingMethod form={methodForm} />
                )}

                {/* Step 2: Patient Details */}
                {currentStep === 2 && (
                  <StepPatientDetails form={patientForm} />
                )}

                {/* Step 3: Test Selection */}
                {currentStep === 3 && (
                  <StepTestSelection form={testForm} />
                )}

                {/* Step 4: Collection/Visit Details */}
                {currentStep === 4 && (
                  <>
                    {formData.method === "home-collection" ? (
                      <StepHomeCollection form={homeCollectionForm} />
                    ) : (
                      <StepLabVisit form={labVisitForm} />
                    )}
                  </>
                )}

                {/* Step 5: Payment */}
                {currentStep === 5 && (
                  <StepPayment
                    form={paymentForm}
                    selectedTests={formData.tests || []}
                    selectedPackages={formData.packages || []}
                    bookingMethod={formData.method}
                  />
                )}

                {/* Step 6: OTP Verification */}
                {currentStep === 6 && (
                  <StepOTPVerification
                    mobile={formData.patient?.mobile || ""}
                    onVerified={handleOTPVerified}
                    isLoading={isLoading}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 6 && (
              <div className="px-4 sm:px-6 lg:px-8 pb-6 flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex-1 sm:flex-none sm:min-w-30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-none sm:min-w-30 bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === 5 ? "Verify Mobile" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          Need help? Call us at{" "}
          <a href="tel:+911234567890" className="text-blue-600 font-medium">
            +91 12345 67890
          </a>
        </motion.p>
      </div>
    </div>
  );
}

export default BookingPage;
