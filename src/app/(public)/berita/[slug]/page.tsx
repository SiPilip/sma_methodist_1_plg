import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import connectDB from "@/lib/db";
import BeritaModel from "@/models/Berita";
import HeroBeritaPage from "@/components/berita/[id]/hero-berita-page";
import BeritaContent from "@/components/berita/[id]/berita-content";

// Types
interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. GENERATE METADATA (SEO OTOMATIS)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  
  // Ambil data seperlunya untuk meta tag
  const berita = await BeritaModel.findOne({ slug, status: "Published" }).select("judul konten thumbnail createdAt kategori author").lean();

  if (!berita) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  // Bersihkan HTML tags dari konten untuk description (max 160 chars)
  const plainText = berita.konten.replace(/<[^>]+>/g, "").substring(0, 160) + "...";

  return {
    title: berita.judul,
    description: plainText,
    category: berita.kategori,
    authors: [{ name: berita.author || "Admin Sekolah" }],
    openGraph: {
      title: berita.judul,
      description: plainText,
      url: `https://smetsaplg.id/berita/${slug}`, // Ganti domain asli
      siteName: "SMA Methodist 1 Palembang",
      images: [
        {
          url: berita.thumbnail || "/img/bg-hero-page.png",
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
      publishedTime: berita.createdAt?.toISOString(),
      section: berita.kategori,
    },
    twitter: {
      card: "summary_large_image",
      title: berita.judul,
      description: plainText,
      images: [berita.thumbnail || "/img/bg-hero-page.png"],
    },
  };
}

// 2. SERVER COMPONENT (RENDER HALAMAN)
export default async function BeritaDetailPage({ params }: PageProps) {
  await connectDB();
  const { slug } = await params;

  // A. Fetch Berita Utama
  const berita = await BeritaModel.findOne({ slug, status: "Published" }).lean();
  
  if (!berita) {
    notFound(); // Redirect ke 404 jika tidak ketemu
  }

  // B. Fetch Berita Lainnya (Untuk Sidebar) - Kecuali berita yang sedang dibuka
  // Ambil 5 berita terbaru
  const beritaLain = await BeritaModel.find({ 
    status: "Published", 
    _id: { $ne: berita._id } // Exclude current ID
  })
  .sort({ createdAt: -1 })
  .limit(5)
  .select("judul slug thumbnail createdAt") // Ambil field seperlunya saja
  .lean();

  // Serialisasi Data (Convert Object ID & Date ke String agar bisa masuk Client Component)
  const serializedBerita = {
    ...berita,
    _id: berita._id.toString(),
    createdAt: berita.createdAt?.toISOString(),
    updatedAt: berita.updatedAt?.toISOString(),
  };

  const serializedBeritaLain = beritaLain.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    createdAt: item.createdAt?.toISOString(),
  }));

  // 3. JSON-LD STRUCTURED DATA
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": berita.judul,
    "image": [berita.thumbnail || "https://smamethodist1palembang.sch.id/img/logo.png"],
    "datePublished": berita.createdAt?.toISOString(),
    "dateModified": berita.updatedAt?.toISOString(),
    "author": {
      "@type": "Person",
      "name": berita.author || "Tim Redaksi"
    }
  };

  return (
    <>
      <Script
        id="news-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Lempar data ke Component Tampilan */}
      <HeroBeritaPage 
        title={berita.judul} 
        category={berita.kategori}
        date={berita.createdAt}
      />
      
      <BeritaContent 
        data={serializedBerita} 
        otherNews={serializedBeritaLain} 
      />
    </>
  );
}