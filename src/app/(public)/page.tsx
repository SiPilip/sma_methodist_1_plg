import type { Metadata } from "next";
import Script from "next/script";

// Komponen Client
import Berita from "@/components/home/berita";
import CardHome from "@/components/home/card-home";
import Hero from "@/components/home/hero";
import TentangKami from "@/components/home/tentang_kami";

// Libs untuk Server Side Fetching
import connectDB from "@/lib/db";
import Siswa from "@/models/Siswa";
import Guru from "@/models/Guru";
import BeritaModel from "@/models/Berita"; // Rename biar gak bentrok dengan component

// --- 1. KONFIGURASI METADATA SEO ---
export const metadata: Metadata = {
  title: "SMA Methodist 1 Palembang - Unggul Berkarakter & Berprestasi",
  description: "Website resmi SMA Methodist 1 Palembang. Lembaga pendidikan Kristen yang berdedikasi menciptakan generasi unggul, beriman, dan berkarakter Kristiani.",
  keywords: ["SMA Methodist 1 Palembang", "Sekolah Palembang", "Sekolah Kristen Palembang", "PPDB Methodist 1", "SMA Terbaik Palembang"],
  openGraph: {
    title: "SMA Methodist 1 Palembang",
    description: "Mewujudkan generasi unggul, beriman, dan berprestasi.",
    url: "https://smetsaplg.id", // Ganti dengan domain asli nanti
    siteName: "SMA Methodist 1 Palembang",
    images: [
      {
        url: "/img/bg-hero-page.png", // Pastikan gambar ini bagus untuk thumbnail share WA
        width: 1200,
        height: 630,
        alt: "Gedung SMA Methodist 1 Palembang",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  alternates: {
    canonical: "https://smetsaplg.id", // Ganti domain asli
  },
};

// --- 2. SERVER SIDE DATA FETCHING ---
// Mengambil data langsung dari DB agar HTML yang dikirim ke Google sudah terisi (SSR)
async function getHomepageData() {
  try {
    await connectDB();
    
    // Fetch Statistik
    // Menggunakan lean() agar return plain JSON object (ringan)
    const [totalSiswa, totalGuru, totalPrestasi] = await Promise.all([
      Siswa.countDocuments({ status: true }),
      Guru.countDocuments({ status: true }),
      BeritaModel.countDocuments({ status: "Published", kategori: "Prestasi" })
    ]);

    const statsData = {
      siswa: totalSiswa,
      guru: totalGuru,
      alumni: 1250, // Hardcode sementara
      prestasi: totalPrestasi
    };

    // Fetch Berita Terbaru (3 item)
    // Perlu .lean() dan serialisasi manual karena Object ID MongoDB gak bisa langsung dipassing ke Client Component
    const rawNews = await BeritaModel.find({ status: "Published" })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const newsData = rawNews.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
    }));

    return { statsData, newsData };

  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return { statsData: null, newsData: [] };
  }
}

export default async function Home() {
  // Eksekusi fetch di server
  const { statsData, newsData } = await getHomepageData();

  // --- 3. JSON-LD STRUCTURED DATA (Schema.org) ---
  // Ini membantu Google memahami bahwa ini adalah website SEKOLAH
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "SMA Methodist 1 Palembang",
    "url": "https://smetsaplg.id",
    "logo": "https://smetsaplg.id/logo.png", // Ganti URL Logo
    "description": "Lembaga pendidikan Kristen unggulan di Palembang.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Jend. Sudirman No.KM 3,5, Pahlawan, Kec. Kemuning", // GANTI dengan alamat asli
      "addressLocality": "Palembang",
      "addressRegion": "Sumatera Selatan",
      "postalCode": "30126", // GANTI
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-711-313861", // GANTI
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/methodist1palembang", // GANTI
      "https://instagram.com/smetsa.id"  // GANTI
    ]
  };

  return (
    <>
      {/* Inject JSON-LD untuk Google */}
      <Script
        id="school-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      
      {/* Pass Initial Data ke Client Component untuk Hydration */}
      <CardHome initialData={statsData} />
      
      <TentangKami />
      
      <Berita initialData={newsData} />
    </>
  );
}