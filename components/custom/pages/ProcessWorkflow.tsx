"use client";

import Image, { StaticImageData } from "next/image";

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  image: StaticImageData | string;
}

export interface ProcessWorkflowProps {
  steps: ProcessStep[];
}

const ProcessWorkflow = ({ steps }: ProcessWorkflowProps) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary lg:left-1/2 lg:-translate-x-1/2" />

        <div className="flex flex-col gap-20">
          {steps.map((step) => (
            <div
              key={step.id}
              className="grid grid-cols-[32px_1fr] lg:grid-cols-[1fr_64px_1fr] gap-6 items-start"
            >
              {/* LEFT IMAGE (Desktop) */}
              <div className="hidden lg:flex justify-end">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={420}
                  height={320}
                  className="rounded-xl object-cover max-w-md"
                />
              </div>

              {/* CENTER DOT */}
              <div className="relative flex justify-center">
                <span className="w-4 h-4 rounded-full border-2 border-primary bg-white z-10 mt-2" />
              </div>

              {/* RIGHT CONTENT */}
              <div>
                {/* IMAGE (Mobile / Tablet) */}
                <div className="block lg:hidden mb-4">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={420}
                    height={300}
                    className="rounded-xl object-cover w-full"
                  />
                </div>

                <h3 className="text-xl font-semibold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xl text-justify">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessWorkflow;
