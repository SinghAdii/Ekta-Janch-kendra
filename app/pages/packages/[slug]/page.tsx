import { packages1, reviews } from "@/components/custom/pages/Data.pages";
import PackageCardCarousel from "@/components/custom/pages/PackageCardCrousel";
import {
  DetailsCard,
  FAQ,
  RatingDistribution,
} from "@/components/custom/pages/pages.components";
import ReviewCarousel from "@/components/custom/pages/ReviewCrousel";
import {
  packageData,
  packageFaqData,
} from "@/components/custom/pages/slug.data";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const data = packageData[slug];
  const faqs = packageFaqData[slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="mt-25">
      {data ? (
        <DetailsCard data={data} />
      ) : (
        <div className="text-red-600">Test not found</div>
      )}
      <PackageCardCarousel packages={packages1} />
      <FAQ items={faqs} />
      <div className="flex justify-center items-center w-full max-w-7xl mx-auto max-md:px-10 flex-wrap my-20 max-md:flex-col gap-15">
        <RatingDistribution ratings={reviews} />
        <ReviewCarousel reviews={reviews} />
      </div>
    </div>
  );
}
