"use client";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export type HealthPackageCardProps = {
  image?: StaticImageData | string;
  title?: string;
  subtitle?: string;
  originalPrice?: string;
  discountedPrice?: string;
  discountBadge?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
  slug: string;
};

export default function PackageCard({
  image,
  title,
  subtitle,
  originalPrice,
  discountedPrice,
  discountBadge,
  slug,
  primaryActionText = "Book Now",
  secondaryActionText = "Know More",
}: HealthPackageCardProps) {
  const navigate = useRouter();
  const onSecondaryAction = () => navigate.push(`/pages/packages/${slug}`);
  const onPrimaryAction = () => navigate.push(`/pages/booking`);
  return (
    <div className="relative w-full max-w-xs rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      {/* Image */}
      {image && (
        <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
          <Image
            src={image}
            alt={title || "Package image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      )}
      {/* Content */}
      <div className="p-4">
        {title && (
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
        )}

        {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}

        {/* Pricing */}
        {(originalPrice || discountedPrice) && (
          <div className="mt-3 flex items-center gap-2">
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {originalPrice}
              </span>
            )}
            {discountedPrice && (
              <span className="text-lg font-semibold text-primary">
                {discountedPrice}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          {secondaryActionText && (
            <button
              onClick={onSecondaryAction}
              className="text-sm text-primary hover:underline cursor-pointer"
            >
              {secondaryActionText}
            </button>
          )}

          {primaryActionText && (
            <button
              onClick={onPrimaryAction}
              className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-500 transition cursor-pointer"
            >
              {primaryActionText}
            </button>
          )}
        </div>
      </div>
      {/* Discount Badge */}
      {discountBadge && (
        <div className="absolute right-0 top-35 h-16 w-16 rounded-full bg-primary border-4 border-white flex flex-col items-center justify-center text-white">
          <div className="font-inter font-bold text-xl leading-none">
            {discountBadge}
          </div>
          <div className="text-sm font-light font-inter leading-none">Off</div>
        </div>
      )}
    </div>
  );
}
