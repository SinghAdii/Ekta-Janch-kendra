"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ReviewCard, ReviewCardProps } from "./ReviewCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewCarouselProps {
  reviews: ReviewCardProps[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ReviewCarousel({
  reviews,
  autoPlay = true,
  interval = 3000,
}: ReviewCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    autoPlay
      ? [
          Autoplay({
            delay: interval,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]
      : []
  );

  if (!reviews.length) return null;

  return (
    <div className="relative w-full max-w-110">
      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="shrink-0" style={{ flex: "0 0 auto" }}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        className="
          absolute inset-y-0 w-full
          flex items-center justify-between
          px-2
          pointer-events-none
        "
      >
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="
            pointer-events-auto
            w-9 h-9 md:w-10 md:h-10
            rounded-full
            bg-primary text-white
            flex items-center justify-center
            shadow-md
            hover:opacity-90
            transition
            max-md:hidden
          "
          aria-label="Previous review"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => emblaApi?.scrollNext()}
          className="
            pointer-events-auto
            w-9 h-9 md:w-10 md:h-10
            rounded-full
            bg-primary text-white
            flex items-center justify-center
            shadow-md
            hover:opacity-90
            transition
            max-md:hidden
          "
          aria-label="Next review"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Mobile Button Position Fix */}
      <div className="md:hidden mt-4 flex justify-end gap-3">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="
            w-9 h-9 rounded-full
            bg-primary text-white
            flex items-center justify-center
            shadow
          "
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={() => emblaApi?.scrollNext()}
          className="
            w-9 h-9 rounded-full
            bg-primary text-white
            flex items-center justify-center
            shadow
          "
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
