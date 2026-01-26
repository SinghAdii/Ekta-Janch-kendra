"use client";

import {
  Herosection,
  Sectionheading,
  ServicecardCrousel,
  Card,
  LeftImageSection,
  RightImageSection,
  PackageCardCrousel,
} from "@/components/custom/pages/pages.components.js";
import { cardImage1 } from "@/assets/images.export.js";
import {
  list,
  services,
  packages,
  heroSlides,
} from "@/components/custom/pages/Data.pages.js";

export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Herosection slides={heroSlides} />
      <Sectionheading
        heading="Health Solutions Chosen by Thousands"
        keyword="See What’s Popular"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />

      <ServicecardCrousel services={services} />

      <Card
        Heading="Why families"
        HeadingKeyword="Trust Us"
        image={cardImage1}
        list={list}
      />

      <LeftImageSection
        image={cardImage1}
        heading={
          <>
            We{" "}
            <span className="text-primary font-inter font-medium">
              take care
            </span>{" "}
            of you
          </>
        }
      />

      <RightImageSection
        image={cardImage1}
        heading={
          <>
            Your{" "}
            <span className="text-primary font-inter font-medium">
              Testing Experience
            </span>{" "}
          </>
        }
      />

      <Sectionheading
        heading="Health Solutions Chosen by Thousands"
        keyword="See What’s Popular"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />

      <PackageCardCrousel packages={packages} showPagination={true} />
    </div>
  );
}
