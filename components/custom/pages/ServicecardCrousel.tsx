"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SvgDefs from "./SvgDefs";
import { Servicecard } from "./pages.components.js";
import { ServiceCardProps } from "./Servicecard.js";

type Service = ServiceCardProps[];

type Props = {
  services: Service;
  showPagination?: boolean;
};

export default function ServiceCarousel({
  services,
  showPagination = false,
}: Props) {
  const useTwoRows = services.length > 8;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
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

      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
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
      requestAnimationFrame(() => {
        setScrollSnaps(emblaApi.scrollSnapList());
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      });
    };

    update();

    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const slides = useTwoRows
    ? services.reduce<ServiceCardProps[][]>((acc, service, index) => {
        const col = Math.floor(index / 2);
        if (!acc[col]) acc[col] = [];
        acc[col].push(service);
        return acc;
      }, [])
    : services.map((service) => [service]);

  return (
    <div className="relative w-full mx-auto max-w-7xl px-4 pb-16">
      <SvgDefs />

      {services.length > 4 && (
        <div className="absolute top-0 left-0 mx-4 flex gap-2 z-10">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="p-2 bg-primary text-white rounded-full transition hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="p-2 bg-primary text-white rounded-full transition hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      <div
        ref={emblaRef}
        className="overflow-hidden mt-16"
        onMouseEnter={() => (isHovering.current = true)}
        onMouseLeave={() => (isHovering.current = false)}
      >
        <div className="flex -ml-4 pr-4">
          {slides.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="pl-4 py-2 max-lg:flex-[0_0_25%] max-md:flex-[0_0_50%] lg:flex-[0_0_25%]"
            >
              <div className={`flex flex-col ${useTwoRows ? "gap-4" : ""}`}>
                {column.map((service, rowIndex) => (
                  <div key={rowIndex}>
                    <Servicecard {...service} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPagination && scrollSnaps.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <div className="flex overflow-hidden bg-linear-to-r from-primary to-primary/40">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`
            px-3 py-1 text-xs font-medium transition-colors
            ${index !== 0 ? "border-l border-white/30" : ""}
            ${
              index === selectedIndex
                ? "bg-primary text-white"
                : "bg-transparent text-white/80 hover:bg-white/10"
            }
          `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
