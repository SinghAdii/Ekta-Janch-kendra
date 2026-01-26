import { LucideIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React from "react";

type ListItem = {
  title: string;
  Icon: LucideIcon;
};

type Props = {
  Heading?: string;
  HeadingKeyword?: string;
  description?: string;
  image: StaticImageData | string;
  list?: ListItem[];
};

export default function Card({
  Heading,
  HeadingKeyword,
  description,
  image,
  list,
}: Props) {
  return (
    <div className="flex w-full max-w-7xl mx-auto flex-col lg:flex-row items-center gap-10 px-5 my-20">
      {/* Left Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light font-Inter">
          {Heading || "Why families"}
          {HeadingKeyword && (
            <span className="text-primary font-inter font-medium">
              {" " + HeadingKeyword}
            </span>
          )}
        </h1>

        <p className="text-base md:text-lg font-light font-Inter text-gray-600 text-justify">
          {description ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem cum tenetur, magnam expedita quisquam dignissimos consectetur officia unde similique dolore hic fuga est error soluta nobis doloribus nostrum praesentium deserunt."}
        </p>

        {list && (
          <div className="flex flex-wrap gap-5 mt-4">
            {list.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 w-full lg:w-[calc(50%-1.25rem)]"
              >
                <div className="bg-primary text-white rounded-full flex items-center justify-center p-2 shrink-0">
                  <item.Icon size={16} />
                </div>
                <h2 className="text-sm md:text-base font-medium">
                  {item.title}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Image */}
      <div className="w-full lg:w-1/2 h-75 md:h-100 lg:h-125 relative">
        <Image
          src={image}
          alt="card image"
          fill
          className="object-cover rounded-xl"
          priority
          quality={100}
        />
      </div>
    </div>
  );
}
