// Booking Page Exports
export { BookingPage } from "./BookingPage";
export { default } from "./BookingPage";

// Types
export type {
  BookingMethod,
  AvailableTest,
  AvailablePackage,
  TimeSlot,
  BookingMethodData,
  PatientDetailsData,
  TestSelectionData,
  HomeCollectionData,
  LabVisitData,
  PaymentData,
  OTPData,
  CompleteBookingData,
  BookingStatus,
  BookingResponse,
} from "./booking.types";

// Schemas
export {
  bookingMethodSchema,
  patientDetailsSchema,
  testSelectionSchema,
  homeCollectionSchema,
  labVisitSchema,
  paymentSchema,
  otpSchema,
} from "./booking.types";

// Data & Helpers
export {
  availableTests,
  availablePackages,
  labLocations,
  timeSlots,
  homeCollectionSlots,
  testCategories,
  packageCategories,
  getTestById,
  getPackageById,
  calculateTestsTotal,
  calculatePackagesTotal,
  calculateGrandTotal,
  getAvailableDates,
  formatDate,
} from "./booking.data";

// Step Components
export { StepBookingMethod } from "./steps/StepBookingMethod";
export { StepPatientDetails } from "./steps/StepPatientDetails";
export { StepTestSelection } from "./steps/StepTestSelection";
export { StepHomeCollection } from "./steps/StepHomeCollection";
export { StepLabVisit } from "./steps/StepLabVisit";
export { StepPayment } from "./steps/StepPayment";
export { StepOTPVerification } from "./steps/StepOTPVerification";
export { BookingSuccess } from "./steps/BookingSuccess";
