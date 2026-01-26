"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, RefreshCw, CheckCircle, Loader2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { otpSchema, OTPData } from "../booking.types";

interface StepOTPVerificationProps {
  mobile: string;
  onVerified: (otp: string) => void;
  isLoading: boolean;
}

export function StepOTPVerification({
  mobile,
  onVerified,
  isLoading,
}: StepOTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Form for validation
  const form = useForm<OTPData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Resend timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (resendTimer > 0 && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setCanResend(true);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendTimer, canResend]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    setVerificationError(null);

    // Update form value
    form.setValue("otp", newOtp.join(""), { shouldValidate: true });

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down for backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData) {
      const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
      setOtp(newOtp);
      form.setValue("otp", newOtp.join(""), { shouldValidate: true });
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  // Handle resend OTP
  // TODO: Integrate with backend API to resend OTP
  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    form.setValue("otp", "");
    setVerificationError(null);
    inputRefs.current[0]?.focus();
    
    // Backend integration point:
    // await api.resendOTP({ mobile });
  };

  // Handle verify
  // TODO: Backend will handle actual OTP verification
  const handleVerify = async () => {
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setVerificationError("Please enter complete 6-digit OTP");
      return;
    }

    // Validate OTP format with Zod
    const validation = form.trigger();
    if (!validation) {
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    // Pass OTP to parent for backend verification
    // The parent component will handle API call and error handling
    onVerified(otpValue);
    
    // Note: setIsVerifying(false) will be handled by parent via isLoading prop
  };

  // Masked mobile number
  const maskedMobile = mobile
    ? `+91 ${mobile.slice(0, 2)}****${mobile.slice(-2)}`
    : "+91 ******";

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Phone className="w-10 h-10 text-blue-600" />
        </motion.div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Verify Your Mobile Number
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          We&apos;ve sent a 6-digit OTP to{" "}
          <span className="font-semibold text-gray-900">{maskedMobile}</span>
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="otp"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {otp.map((digit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <Input
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className={cn(
                              "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 rounded-lg transition-all",
                              digit
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300",
                              verificationError && "border-red-500"
                            )}
                            disabled={isVerifying || isLoading}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-center mt-2" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Error Message */}
          {verificationError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-500 text-sm"
            >
              {verificationError}
            </motion.p>
          )}

          {/* Resend OTP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            {canResend ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend OTP
              </Button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend OTP in{" "}
                <span className="font-semibold text-gray-700">
                  {resendTimer}s
                </span>
              </p>
            )}
          </motion.div>

          {/* Verify Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="button"
              onClick={handleVerify}
              disabled={otp.join("").length !== 6 || isVerifying || isLoading}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verify & Confirm Booking
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-50 rounded-lg p-4 flex items-start gap-3"
      >
        <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-gray-700 font-medium">
            Your information is secure
          </p>
          <p className="text-xs text-gray-500 mt-1">
            We use industry-standard encryption to protect your personal and
            payment information.
          </p>
        </div>
      </motion.div>

      {/* Help Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-sm text-gray-500"
      >
        Didn&apos;t receive OTP?{" "}
        <a href="tel:+911234567890" className="text-blue-600 hover:underline">
          Contact Support
        </a>
      </motion.p>
    </div>
  );
}
