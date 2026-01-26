"use client";

import Image, { StaticImageData } from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

interface propsType {
  title?: React.ReactNode | string;
  subtitle?: string;
  image: StaticImageData | string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AppointmentCard = ({
  title = "Book an Appointment",
  subtitle = "We will send you a confirmation within 24 hours",
  image,
  onSubmit,
}: propsType) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If consumer provides custom submit logic
    if (onSubmit) {
      onSubmit(e);
      return;
    }

    // ✅ Default Sonner toast
    toast.success("Appointment booked successfully", {
      description: "We will contact you within 24 hours.",
    });
  };

  //* todo - 1. add the zod form validations;
  //* todo - 2. add the backend;

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Section */}
        <div className="relative">
          <Image
            src={image}
            alt="Appointment"
            className="w-full h-full object-cover rounded-xl"
            width={500}
            height={500}
          />

          {/* WhatsApp Icon */}
          <div className="absolute bottom-10 right-10 max-lg:bottom-0 max-lg:right-0 bg-green-500 p-3 rounded-full shadow-lg cursor-pointer">
            <FaWhatsapp className="text-white text-2xl" size={40} />
          </div>
        </div>

        {/* Right Section */}
        <div className="font-inter">
          <h2 className="text-5xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">{subtitle}</p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Full Name */}
            <div>
              <label className="label">
                Full Name<span className="text-red-500">*</span>
              </label>
              <input type="text" className="input" required />
            </div>

            {/* DOB */}
            <div>
              <label className="label">
                Date of Birth<span className="text-red-500">*</span>
              </label>
              <input type="date" className="input" required />
            </div>

            {/* Email */}
            <div>
              <label className="label">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="input"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="label">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input type="tel" placeholder="+91" className="input" required />
            </div>

            {/* Gender */}
            <div>
              <label className="label">
                Gender<span className="text-red-500">*</span>
              </label>
              <select className="input" required>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Upload Document */}
            <div>
              <label className="label">
                Upload Document<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                className="input file:mr-3 file:border-0 file:bg-primary file:text-white file:px-3 file:py-1 file:rounded-md"
                required
              />
            </div>

            {/* Service */}
            <div className="md:col-span-2">
              <label className="label">
                Service<span className="text-red-500">*</span>
              </label>
              <select className="input" required>
                <option value="">Specialist, doctor</option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="label">Any Notes</label>
              <textarea
                className="input h-24 resize-none"
                placeholder="Optional"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="md:col-span-2 bg-primary hover:opacity-90 text-white py-2 rounded-lg transition"
            >
              Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
