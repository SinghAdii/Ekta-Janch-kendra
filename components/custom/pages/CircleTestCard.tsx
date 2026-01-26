import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  image: StaticImageData | string;
  slug: string;
};

export function CircleTestCard({ title, image, slug }: Props) {
  return (
    <Link
      href={`/test-booking/${slug}`}
      className="flex flex-col items-center gap-3 group"
    >
      <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-slate-200 group-hover:border-primary transition">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>

      <div className="text-center">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-primary flex items-center gap-1 justify-center">
          Know More →
        </span>
      </div>
    </Link>
  );
}
