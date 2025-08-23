import BeritaContent from "@/components/berita/[id]/berita-content";
import HeroBeritaPage from "@/components/berita/[id]/hero-berita-page";
import { Metadata } from "next";

// Data berita (nanti bisa dari API/database)
const beritaData = {
  id: "field-trip-museum-science",
  title: "KEGIATAN FIELD TRIP KELAS IX MENGUNJUNGI MUSEUM SCIENCE",
  description:
    "Siswa kelas IX melakukan kegiatan field trip edukatif ke Museum Science untuk menambah wawasan dan pengetahuan di bidang sains dan teknologi. Kegiatan ini bertujuan untuk memberikan pengalaman belajar langsung di luar kelas.",
  content:
    "Lorem ipsum dolor sit amet consectetur. Nisl purus leo eu augue. Orci viverra facilisi etiam id pretium eu quis. Vulputate erat sed quis congue hendrerit lectus orci molestie ut...",
  image: "/img/bg-hero-page.png",
  publishedDate: "2024-03-15",
  modifiedDate: "2024-03-15",
  author: "Tim Redaksi Sekolah",
  category: "Kegiatan Sekolah",
  tags: ["field trip", "museum", "pendidikan", "kelas IX", "sains"],
  url: "/berita/field-trip-museum-science",
};

// Static Metadata untuk SEO
export const metadata: Metadata = {
  title: beritaData.title,
  description: beritaData.description,
  keywords: beritaData.tags.join(", "),
  authors: [{ name: beritaData.author }],
  category: beritaData.category,

  // Open Graph untuk Facebook
  openGraph: {
    type: "article",
    title: beritaData.title,
    description: beritaData.description,
    url: `https://yourwebsite.com${beritaData.url}`,
    siteName: "Website Sekolah",
    images: [
      {
        url: `https://yourwebsite.com${beritaData.image}`,
        width: 1200,
        height: 630,
        alt: beritaData.title,
      },
    ],
    publishedTime: beritaData.publishedDate,
    modifiedTime: beritaData.modifiedDate,
    authors: [beritaData.author],
    section: beritaData.category,
    tags: beritaData.tags,
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: beritaData.title,
    description: beritaData.description,
    images: [`https://yourwebsite.com${beritaData.image}`],
    creator: "@yourschool_twitter",
    site: "@yourschool_twitter",
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: `https://yourwebsite.com${beritaData.url}`,
  },

  // Additional meta tags
  other: {
    "article:published_time": beritaData.publishedDate,
    "article:modified_time": beritaData.modifiedDate,
    "article:author": beritaData.author,
    "article:section": beritaData.category,
    "article:tag": beritaData.tags.join(","),
  },
};

// JSON-LD Structured Data untuk Rich Snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: beritaData.title,
  description: beritaData.description,
  image: [`https://yourwebsite.com${beritaData.image}`],
  datePublished: beritaData.publishedDate,
  dateModified: beritaData.modifiedDate,
  author: {
    "@type": "Person",
    name: beritaData.author,
  },
  publisher: {
    "@type": "Organization",
    name: "Website Sekolah",
    logo: {
      "@type": "ImageObject",
      url: "https://yourwebsite.com/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://yourwebsite.com${beritaData.url}`,
  },
  articleSection: beritaData.category,
  keywords: beritaData.tags.join(","),
  url: `https://yourwebsite.com${beritaData.url}`,
};

export default function Berita() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroBeritaPage title="KEGIATAN FIELD TRIP KELAS IX MENGUNJUNGI MUSEUM SCIENCE" />
      <BeritaContent />
    </>
  );
}
