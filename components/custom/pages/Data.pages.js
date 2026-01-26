import {
  crouselImg1,
  crouselImg2,
  crouselImg3,
  crouselImg4,
  workflow1,
  workflow2,
  workflow3,
  circleTest1,
  circleTest2,
  circleTest3,
  circleTest4,
  circleTest5,
  avatar1,
} from "@/assets/images.export.js";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

import { Clock, Lock } from "lucide-react";

export const heroSlides = [
  {
    id: 1,
    image: "/assets/images/hero-bg-home.png",
    heading: (
      <>
        <p className="font-inter font-medium">
          Trusted{" "}
          <span className="text-primary font-inter font-medium block">
            diagnostics
          </span>{" "}
          Reliable Results
        </p>
      </>
    ),
    description:
      "Advanced pathology, radiology, and health checkup services with accurate reports and expert care.",
    primaryCTA: {
      text: "Book a Test",
      link: "/book-test",
    },
    secondaryCTA: {
      text: "View Packages",
      link: "/packages",
    },
  },
  {
    id: 2,
    image: "/assets/images/hero-bg-2.png",
    heading: (
      <>
        <p className="font-inter font-medium">
          Your{" "}
          <span className="text-primary font-inter font-medium block">
            health,
          </span>{" "}
          our priority
        </p>
      </>
    ),
    description:
      "From routine tests to comprehensive health packages, we deliver precision diagnostics you can trust.",
    primaryCTA: {
      text: "Explore Services",
      link: "/services",
    },
    secondaryCTA: {
      text: "Contact Us",
      link: "/contact",
    },
    enableOverlay: true,
  },
];

export const services = [
  {
    id: 1,
    title: "Neurology",
    image: crouselImg1,
    slug: "neurology",
  },
  {
    id: 2,
    title: "Cardiology",
    image: crouselImg2,
    slug: "cardiology",
  },
  {
    id: 3,
    title: "Orthopedics",
    image: crouselImg3,
    slug: "orthopedics",
  },
  {
    id: 4,
    title: "Surgery",
    image: crouselImg4,
    slug: "surgery",
  },
];

export const list = [
  {
    title: "24/7 Availability",
    Icon: Clock,
  },
  {
    title: "Trusted by Thousands",
    Icon: Lock,
  },
  {
    title: "24/7 Availability",
    Icon: Clock,
  },
  {
    title: "Trusted by Thousands",
    Icon: Lock,
  },
  {
    title: "24/7 Availability",
    Icon: Clock,
  },
  {
    title: "Trusted by Thousands",
    Icon: Lock,
  },
];

export const packages = [
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },

  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },

  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },

  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },

  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },

  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },

  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },

  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },

  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
];

export const footerColumns = [
  {
    title: "Home",
    links: [
      { label: "Test Booking" },
      { label: "Packages" },
      { label: "Reports" },
      { label: "Doctor Collaboration" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Blood Test" },
      { label: "Health Checkups" },
      { label: "Radiology" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About Us" }, { label: "Careers" }, { label: "Contact" }],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center" },
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
    ],
  },
];

export const socialLinks = [
  { icon: FaLinkedinIn, href: "#" },
  { icon: FaFacebook, href: "#" },
  { icon: FaInstagram, href: "#" },
  { icon: FaYoutube, href: "#" },
];

//test-booking

export const serviceCardsData = [
  {
    title: "Complete Blood Count (CBC)",
    image: crouselImg1,
    price: {
      original: 600,
      final: 399,
      currency: "₹",
    },
    ctaText: "Book Now",
    iconType: "Booking",
    slug: "cbc",
  },
  {
    title: "Full Body Health Checkup",
    image: crouselImg2,
    price: {
      original: 4999,
      final: 2999,
      currency: "₹",
    },
    ctaText: "View Package",
    iconType: "Booking",
    slug: "full-body",
  },
  {
    title: "MRI Scan",
    image: crouselImg3,
    price: {
      final: 4500,
      currency: "₹",
    },
    ctaText: "Schedule Scan",
    iconType: "Booking",
    slug: "mri",
  },
  {
    title: "MRI Scan",
    image: crouselImg4,
    price: {
      final: 4500,
      currency: "₹",
    },
    ctaText: "Schedule Scan",
    iconType: "Booking",
    slug: "mri",
  },
  {
    title: "Complete Blood Count (CBC)",
    image: crouselImg1,
    price: {
      original: 600,
      final: 399,
      currency: "₹",
    },
    ctaText: "Book Now",
    iconType: "Booking",
    slug: "cbc",
  },
  {
    title: "Full Body Health Checkup",
    image: crouselImg2,
    price: {
      original: 4999,
      final: 2999,
      currency: "₹",
    },
    ctaText: "View Package",
    iconType: "Booking",
    slug: "full-body",
  },
  {
    title: "MRI Scan",
    image: crouselImg3,
    price: {
      final: 4500,
      currency: "₹",
    },
    ctaText: "Schedule Scan",
    iconType: "Booking",
    slug: "mri",
  },
  {
    title: "MRI Scan",
    image: crouselImg4,
    price: {
      final: 4500,
      currency: "₹",
    },
    ctaText: "Schedule Scan",
    iconType: "Booking",
    slug: "mri",
  },
  {
    title: "MRI Scan",
    image: crouselImg3,
    price: {
      final: 4500,
      currency: "₹",
    },
    ctaText: "Schedule Scan",
    iconType: "Booking",
    slug: "mri",
  },
  {
    title: "MRI Scan",
    image: crouselImg4,
    price: {
      final: 4500,
      currency: "₹",
    },
    ctaText: "Schedule Scan",
    iconType: "Booking",
    slug: "mri",
  },
];

export const steps = [
  {
    id: "1",
    image: workflow1,
    title: "Book Appointment",
    description:
      //generate the long description for each of them by tab pressing
      "Choose your preferred service, doctor, and time slot effortlessly. Book your appointment with ease and convenience. Book your appointment with ease and convenience.",
  },
  {
    id: "2",
    image: workflow2,
    title: "Upload Documents",
    description:
      "Securely upload required documents before your visit. Upload your documents with ease and convenience. Upload your documents with ease and convenience.",
  },
  {
    id: "3",
    image: workflow3,
    title: "Consultation",
    description:
      "Meet the specialist and get professional advice. Get your consultation with ease and convenience. Get your consultation with ease and convenience. ",
  },
];

export const reviews = [
  {
    name: "Sourav Bansal",
    avatar: avatar1,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Sourav Bansal",
    avatar: avatar1,
    rating: 4,
    review:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Sourav Bansal",
    avatar: avatar1,
    rating: 3,
    review: "Short review text.",
  },
];

//packages
export const packages1 = [
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
  {
    image: crouselImg1,
    title: "Full Body checkup essential",
    subtitle: "Includes 13 tests",
    originalPrice: "₹ 2,999",
    discountedPrice: "₹ 1,499",
    discountBadge: "20%",
    slug: "full-body-checkup-essential",
  },
];

export const circleTestCarouselData = [
  {
    title: "Iron test",
    image: circleTest1,
    slug: "iron-test",
  },
  {
    title: "Hormone Test",
    image: circleTest2,
    slug: "hormone-test",
  },
  {
    title: "Anemia test",
    image: circleTest3,
    slug: "anemia-test",
  },
  {
    title: "Female Cancer",
    image: circleTest4,
    slug: "female-cancer",
  },
  {
    title: "Infertility Test",
    image: circleTest5,
    slug: "infertility-test",
  },
];
