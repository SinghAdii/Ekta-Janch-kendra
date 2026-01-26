"use client";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { LucideArrowUpRight, LucideClipboardPlus } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export type PriceInfo = {
  original?: number;
  final: number;
  currency?: string;
};

export type ServiceCardProps = {
  title: string;
  image: StaticImageData | string;

  price?: PriceInfo;
  ctaText?: string;

  iconType?: string;
  slug?: string;
};

export default function ServiceCard({
  title,
  image,
  price,
  ctaText,
  iconType = "Redirect",
  slug,
}: ServiceCardProps) {
  const hasBottomContent = Boolean(price && ctaText);
  const primaryhref = `/pages/test-booking/${slug}`;
  const secondaryhref = `/pages/test-booking/${slug}`;

  const navigate = useRouter();
  const onCardClick = () => {
    navigate.push(secondaryhref);
  };

  return (
    <div
      onClick={onCardClick}
      className={clsx(
        "w-68 transition cursor-pointer",
        hasBottomContent
          ? "bg-white rounded-2xl shadow-md hover:shadow-lg"
          : "bg-transparent shadow-none rounded-none"
      )}
    >
      {/* IMAGE SECTION */}
      <div className="relative">
        <div
          className="relative h-70 w-full overflow-hidden"
          style={{ clipPath: "url(#service-card-shape)" }}
        >
          <Image src={image} alt={title} fill className="object-cover" />

          <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent" />

          <div className="absolute bottom-0 left-0 p-5 z-10">
            <h3 className="text-white text-lg max-w-1/2 font-semibold">
              {title}
            </h3>
          </div>
        </div>

        {/* Floating Icon */}

        <div className="absolute bottom-3 right-4 z-20">
          <Link
            href={iconType === "Booking" ? primaryhref : secondaryhref}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition">
              {iconType === "Booking" ? (
                <LucideClipboardPlus size={20} />
              ) : (
                <LucideArrowUpRight size={20} />
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* BOTTOM CONTENT */}
      {hasBottomContent && (
        <div className="px-4 py-3 flex items-center justify-between">
          {price && (
            <div className="flex flex-col">
              {price.original !== undefined && (
                <span className="text-sm text-gray-400 line-through">
                  {price.currency ?? "₹"} {price.original}
                </span>
              )}
              <span className="text-lg font-semibold text-primary">
                {price.currency ?? "₹"} {price.final}
              </span>
              <Link
                href={secondaryhref}
                className="flex items-center text-gray-500 hover:cursor-pointer hover:text-primary font-inter text-sm capitalize"
              >
                Know More <LucideArrowUpRight size={15} />
              </Link>
            </div>
          )}

          {ctaText && (
            <Link
              href={primaryhref}
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              {ctaText}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
