import { Phone } from "lucide-react";
import Image, { StaticImageData } from "next/image";

type CTACardProps = {
  image: StaticImageData | string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

export default function CTACard({
  image,
  title = "Not sure which test is right for you?",
  subtitle = "We're here to help",
  buttonText = "Give us a call",
  onButtonClick,
}: CTACardProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 my-10">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white border rounded-xl shadow-sm p-6">
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <div className="relative h-50 w-full md:h-80 md:w-80 rounded-lg overflow-hidden">
            <Image src={image} alt="Support" fill className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl md:text-4xl font-medium underline-offset-4">
              {title}
            </h3>
            <p className="text-primary text-center text-xl md:text-4xl mt-1 font-medium">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onButtonClick}
            className="flex gap-2 items-center px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition cursor-pointer"
          >
            {buttonText}
            <Phone size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
