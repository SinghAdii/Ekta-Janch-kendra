import Image from "next/image";
import React from "react";

type Stat = {
  value: string;
  label: string;
};

type Props = {
  image: string;
  heading?: React.ReactNode;
  description?: string;
  stats?: Stat[];
};

export default function CareSection({
  image,
  heading = "We take care of you",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt, ligula nec cursus facilisis, lacus felis ultricies massa, in lacinia arcu justo a velit. Proin ut mi eget lorem ultricies pretium nec nec purus. Curabitur efficitur.",
  stats = [
    { value: "35+", label: "Certified Specialists" },
    { value: "12+", label: "Years of Clinical & Scientific Expertise" },
    { value: "345+", label: "Successful Surgeries" },
  ],
}: Props) {
  return (
    <section className="w-full max-w-7xl mx-auto px-5 py-20">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-14">
        {/* Left Image */}
        <div
          className="w-full lg:w-1/3"
          style={{ clipPath: "url(#service-card-shape)" }}
        >
          <div className="relative h-95 md:h-120 lg:h-100 rounded-2xl overflow-hidden">
            <Image
              src={image}
              alt="Medical care"
              fill
              quality={100}
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-2/3">
          <h2 className="capitalize text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
            {heading}
          </h2>

          <p className="mt-6 text-gray-600 text-base md:text-lg text-justify">
            {description}
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 max-md:grid-cols-2 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl text-center font-semibold text-primary">
                  {stat.value}
                </div>
                <p className="mt-2 text-md text-center text-gray-700">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
