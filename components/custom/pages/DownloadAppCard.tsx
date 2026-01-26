import Image, { StaticImageData } from "next/image";

type DownloadAppCardProps = {
  title?: string;
  description?: string;
  appStoreLink?: string;
  playStoreLink?: string;
  rightImage: StaticImageData | string;
};

export default function DownloadAppCard({
  title = "Download Our App Now",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  appStoreLink = "#",
  playStoreLink = "#",
  rightImage,
}: DownloadAppCardProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <div className="relative bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-8 p-6 lg:p-10">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold mb-3">{title}</h2>

            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <a href={appStoreLink} target="_blank">
                <Image
                  src="/assets/images/appstore.png"
                  alt="Download on App Store"
                  width={150}
                  height={45}
                  className="cursor-pointer"
                />
              </a>

              <a href={playStoreLink} target="_blank">
                <Image
                  src="/assets/images/playstore.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={45}
                  className="cursor-pointer"
                />
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE – OUTSIDE CARD */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-85 h-80">
            <Image
              src={rightImage}
              alt="App Mockup"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
