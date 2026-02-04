import { LucideIcon, LogIn } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { IconType } from "react-icons/lib";

export type FooterLink = {
  label: string;
  href?: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type SocialLink = {
  icon: IconType | LucideIcon;
  href: string;
};

type FooterProps = {
  logo: StaticImageData | string;
  columns: FooterColumn[];
  socials: SocialLink[];
  copyright?: string;
  showAppDownload?: boolean;
};

export default function Footer({
  logo,
  columns,
  socials,
  copyright,
  showAppDownload = true,
}: FooterProps) {
  return (
    <footer className="bg-[#174F69] text-white">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {columns.map((col, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.href || "#"} className="hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {showAppDownload && (
            <div>
              <h4 className="font-semibold mb-4">Download the App</h4>
              <div className="w-28 h-28 bg-gray-200 rounded-md" />
              <p className="mt-2 text-sm text-gray-200">Android / iOS</p>
            </div>
          )}
        </div>

        {/* Bottom section */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Image
            src={logo}
            alt="Company Logo"
            width={160}
            height={100}
            quality={100}
            className="object-contain w-50"
          />

          {/* Copyright */}
          <p className="text-sm text-gray-200 text-center">
            {copyright || "© 2025 Company Name. All rights reserved."}
          </p>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {/* Partner Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              <LogIn size={16} />
              Partner Login
            </Link>

            {socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition"
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
