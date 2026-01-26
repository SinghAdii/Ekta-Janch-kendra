"use client";
import { appDownload, caller } from "@/assets/images.export";
import CircleTestCarousel from "@/components/custom/pages/CircleTestCrousel";
import {
  circleTestCarouselData,
  packages1,
} from "@/components/custom/pages/Data.pages";
import {
  PackageCardCrousel,
  Sectionheading,
  Herosection,
  CTACard,
  DownloadAppCard,
} from "@/components/custom/pages/pages.components";

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
          keyword="See What’s Popular"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />

        <PackageCardCrousel packages={packages1} showPagination={true} />

        <Sectionheading
          heading="Health Solutions Chosen by Thousands"
          keyword="See What’s Popular"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <CircleTestCarousel items={circleTestCarouselData} />
        <CTACard
          image={caller}
          onButtonClick={() => (window.location.href = "tel:12345678")}
        />
        <DownloadAppCard
          rightImage={appDownload}
          appStoreLink="https://apple.com"
          playStoreLink="https://play.google.com"
        />
      </div>
    </>
  );
}
