"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircleTestCard } from "./CircleTestCard";
import { StaticImageData } from "next/image";

type Props = {
  items: {
    title: string;
    image: StaticImageData | string;
    slug: string;
  }[];
  showPagination?: boolean;
};

export default function CircleTestCarousel({
  items,
  showPagination = false,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
  });

  const autoplayRef = useRef<number | null>(null);
  const isHovering = useRef(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const startAutoplay = useCallback(() => {
    if (!emblaApi || autoplayRef.current) return;

    autoplayRef.current = window.setInterval(() => {
      if (isHovering.current) return;

      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, 3500);
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (!autoplayRef.current) return;
    clearInterval(autoplayRef.current);
    autoplayRef.current = null;
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-10">
      {items.length >= 5 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div
        ref={emblaRef}
        className="overflow-hidden"
        onMouseEnter={() => (isHovering.current = true)}
        onMouseLeave={() => (isHovering.current = false)}
      >
        <div className="flex gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-[0_0_20%] max-lg:flex-[0_0_33%] max-md:flex-[0_0_50%]"
            >
              <CircleTestCard {...item} />
            </div>
          ))}
        </div>
      </div>

      {showPagination && scrollSnaps.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition ${
                index === selectedIndex ? "bg-primary w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
