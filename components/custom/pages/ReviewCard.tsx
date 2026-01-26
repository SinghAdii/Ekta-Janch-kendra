"use client";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";

export type ReviewCardProps = {
  name: string;
  avatar: StaticImageData | string;
  rating: number;
  review: string;
};

export const ReviewCard = ({
  name,
  avatar,
  rating,
  review,
}: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const safeRating = Math.min(Math.max(Math.floor(rating), 1), 5);
  const isLong = review.length > 120;

  return (
    <div
      className="
        w-110 h-42 max-md:w-90
        bg-white rounded-xl border shadow-sm
        p-4 flex gap-4
      "
    >
      {/* Avatar */}
      <Image
        src={avatar}
        alt={name}
        width={56}
        height={56}
        className="w-14 h-14 rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-primary">{name}</h4>

          <div className="flex gap-0.5 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < safeRating ? "text-yellow-400" : "text-gray-300"}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Review text */}
        <p
          className={`
            text-sm text-gray-600 mt-1 leading-snug
            ${!expanded ? "line-clamp-3" : ""}
          `}
        >
          {review}
        </p>

        {/* Read more */}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary font-medium mt-auto self-start"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
};
