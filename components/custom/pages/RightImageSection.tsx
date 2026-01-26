import Image from "next/image";
import React from "react";

type points = {
  title: string;
  description: string;
};

type Props = {
  image: string;
  heading?: React.ReactNode;
  description?: string;
  points?: points[];
};

export default function CareSection({
  image,
  heading = "We take care of you",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt, ligula nec cursus facilisis, lacus felis ultricies massa, in lacinia arcu justo a velit.",
  points = [
    {
      title: "Clear Instructions",
      description:
        "We explain everything beforehand so you feel fully prepared.",
    },
    {
      title: "Gentle & Stress-Free",
      description: "Designed to minimize discomfort and anxiety.",
    },
    {
      title: "Support at Every Step",
      description:
        "We explain everything beforehand so you feel fully prepared.",
    },
  ],
}: Props) {
  return (
    <section className="w-full max-w-7xl mx-auto px-5 py-20">
      <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-14">
        {/* Left Content */}
        <div className="w-full lg:w-2/3">
          <h2 className="capitalize text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
            {heading}
          </h2>

          <p className="mt-6 text-gray-600 text-base md:text-lg text-justify">
            {description}
          </p>

          {/* Points */}
          <div className="mt-10 flex flex-col items-start gap-6">
            {points.map((points, index) => (
              <div key={index} className="ml-5">
                <div className="text-xl capitalize font-bold font-inter text-primary leading-none">
                  {points.title}
                </div>
                <p className="mt-2 text-md text-gray-700 text-justify leading-none">
                  {points.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/3">
          <div
            className="relative max-md:h-70 max-lg:h-120 lg:h-100"
            style={{
              clipPath: "url(#service-left-card-shape)",
              WebkitClipPath: "url(#service-left-card-shape)",
            }}
          >
            <Image
              src={image}
              alt="Medical care"
              fill
              quality={100}
              priority
              className="object-cover rounded-2xl md:w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
