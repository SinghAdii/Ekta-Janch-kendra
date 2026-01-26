import React from "react";

type Props = {
  heading: string;
  keyword?: string;
  description?: string;
};

export default function Sectionheading({
  heading,
  keyword,
  description,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full text-center text-3xl md:text-[42px] text-black font-inter font-light leading-tight capitalize mt-10 mb-10 md:mt-20 md:mb-10 px-4">
      {heading}
      {keyword && (
        <div className="text-primary capitalize font-light">{keyword}</div>
      )}
      {description && (
        <div className="text-lg text-black font-inter font-light capitalize mt-4">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}
