"use client";
import {
  reviews,
  serviceCardsData,
  steps,
} from "@/components/custom/pages/Data.pages";
import {
  Herosection,
  RatingDistribution,
  Sectionheading,
  ProcessWorkflow,
} from "@/components/custom/pages/pages.components.js";
import ReviewCarousel from "@/components/custom/pages/ReviewCrousel";
import ServiceCarousel from "@/components/custom/pages/ServicecardCrousel";

export default function page() {
  return (
    <>
      <div>
        <Herosection
          slides={[
            {
              id: 1,
              image: "/assets/images/hero-bg-home.png",
              heading: (
                <>
                  <p className="font-inter font-medium">
                    Trusted{" "}
                    <span className="text-primary font-inter font-medium block">
                      diagnostics
                    </span>{" "}
                    Reliable Results
                  </p>
                </>
              ),
              description:
                "Advanced pathology, radiology, and health checkup services with accurate reports and expert care.",
              primaryCTA: {
                text: "Book a Test",
                link: "/book-test",
              },
              secondaryCTA: {
                text: "View Packages",
                link: "/packages",
              },
            },
          ]}
        />
        <Sectionheading
          heading="Health Solutions Chosen by Thousands"
          keyword="See What's Popular"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <ServiceCarousel services={serviceCardsData} showPagination={true} />
        <Sectionheading
          heading="How to Book Your Test"
          keyword="3 Easy Steps"
          description="Book your diagnostic tests in just a few minutes with our simple booking process."
        />
        <ProcessWorkflow steps={steps} />

        <div className="flex justify-center items-center w-full max-w-7xl mx-auto max-md:px-10 flex-wrap my-20 max-md:flex-col gap-15">
          <RatingDistribution ratings={reviews} />
          <ReviewCarousel reviews={reviews} />
        </div>
      </div>
    </>
  );
}
