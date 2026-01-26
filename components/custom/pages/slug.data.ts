// test slug page data

import { FAQItem } from "./FAQ";
import { TestDetailData } from "./DetailsCard";

export const testData: Record<string, TestDetailData> = {
  cbc: {
    name: "Complete Blood Count (CBC)",
    description:
      "A Complete Blood Count (CBC) test evaluates your overall health and detects a wide range of disorders, including anemia, infection, and leukemia.",

    details: {
      testName: "Complete Blood Count",
      sampleType: "Blood",
      gender: "All",
      ageGroup: "All age groups",
      reportTimeline: "Same day",
      includes: "Hemoglobin, RBC count, WBC count, Platelet count, Hematocrit",
      discount: "33% off",
      originalPrice: 600,
      finalPrice: 399,
      currency: "₹",
    },

    pdfUrl: "/pdfs/cbc-test-details.pdf",
  },

  "full-body": {
    name: "Full Body Health Checkup",
    description:
      "A comprehensive health checkup package designed to assess your overall health and detect potential issues early.",

    details: {
      testName: "Full Body Health Checkup",
      sampleType: "Blood & Urine",
      gender: "All",
      ageGroup: "18 years and above",
      reportTimeline: "24–48 hours",
      includes:
        "CBC, Liver Function Test, Kidney Function Test, Lipid Profile, Thyroid Profile, Blood Sugar, Urine Analysis",
      discount: "40% off",
      originalPrice: 4999,
      finalPrice: 2999,
      currency: "₹",
    },

    pdfUrl: "/pdfs/full-body-checkup-details.pdf",
  },

  mri: {
    name: "MRI Scan",
    description:
      "Magnetic Resonance Imaging (MRI) is a safe and painless test that produces detailed images of organs and structures inside the body.",

    details: {
      testName: "MRI Scan",
      sampleType: "Imaging (No sample required)",
      gender: "All",
      ageGroup: "All age groups",
      reportTimeline: "Same day or next day",
      includes: "High-resolution imaging, Radiologist report, Digital films",
      discount: "No discount",
      originalPrice: 5000,
      finalPrice: 4500,
      currency: "₹",
    },

    pdfUrl: "/pdfs/mri-scan-details.pdf",
  },
};

export const faqDataBySlug: Record<string, FAQItem[]> = {
  cbc: [
    {
      question: "What is a CBC test?",
      answer:
        "A Complete Blood Count (CBC) test measures different components of blood such as red blood cells, white blood cells, hemoglobin, and platelets.",
    },
    {
      question: "Is fasting required for a CBC test?",
      answer:
        "No, fasting is not required for a CBC test unless advised by your doctor.",
    },
    {
      question: "How long does it take to get CBC results?",
      answer: "CBC test reports are usually available on the same day.",
    },
  ],

  "full-body": [
    {
      question: "What is included in a full body checkup?",
      answer:
        "A full body checkup includes blood tests, liver and kidney function tests, thyroid profile, lipid profile, blood sugar, and urine analysis.",
    },
    {
      question: "Who should opt for a full body checkup?",
      answer:
        "Anyone above 18 years of age, especially those with a sedentary lifestyle or existing health conditions.",
    },
    {
      question: "How often should a full body checkup be done?",
      answer:
        "It is recommended to undergo a full body checkup once every year.",
    },
  ],

  mri: [
    {
      question: "What is an MRI scan?",
      answer:
        "MRI is a diagnostic imaging technique that uses magnetic fields and radio waves to generate detailed images of organs and tissues.",
    },
    {
      question: "Is MRI scan painful?",
      answer: "No, an MRI scan is completely painless and non-invasive.",
    },
    {
      question: "How long does an MRI scan take?",
      answer:
        "An MRI scan typically takes between 30 to 60 minutes depending on the body part being examined.",
    },
  ],
};

// packages slug data

export const packageData: Record<string, TestDetailData> = {
  "full-body-checkup-essential": {
    name: "Full Body Checkup Essential",
    description:
      "The Full Body Checkup Essential package includes a curated set of diagnostic tests designed to provide an overview of your overall health and detect early signs of common conditions.",

    details: {
      testName: "Full Body Checkup Essential",
      sampleType: "Blood & Urine",
      gender: "All",
      ageGroup: "18 years and above",
      reportTimeline: "24–48 hours",
      includes:
        "Complete Blood Count, Blood Sugar, Lipid Profile, Liver Function Test, Kidney Function Test, Thyroid Profile, Urine Routine",
      discount: "20% off",
      originalPrice: 2999,
      finalPrice: 1499,
      currency: "₹",
    },

    pdfUrl: "/pdfs/full-body-checkup-essential.pdf",
  },
};

export const packageFaqData: Record<string, FAQItem[]> = {
  "full-body-checkup-essential": [
    {
      question: "What tests are included in the Full Body Checkup Essential?",
      answer:
        "This package includes 13 essential diagnostic tests covering blood health, liver function, kidney function, cholesterol levels, blood sugar, thyroid function, and urine analysis.",
    },
    {
      question: "Is fasting required for this health checkup?",
      answer:
        "Yes, fasting of 8–10 hours is recommended before sample collection for accurate blood sugar and lipid profile results.",
    },
    {
      question: "Who should opt for the Full Body Checkup Essential package?",
      answer:
        "This package is ideal for adults looking for a basic preventive health screening or those undergoing routine annual health checkups.",
    },
    {
      question: "How long does it take to receive the reports?",
      answer:
        "Reports are generally available within 24 to 48 hours after sample collection.",
    },
    {
      question: "Can I download my reports online?",
      answer:
        "Yes, digital reports will be available for download, and a detailed PDF can be accessed from your dashboard.",
    },
  ],
};
