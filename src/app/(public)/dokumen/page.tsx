import { Metadata } from "next";
import DokumenClient from "@/components/dokumen/dokumen"; // Kita rename komponen client
import HeroPage from "@/components/hero-page";

export const metadata: Metadata = {
  title: "Download Dokumen & SK - SMA Methodist 1 Palembang",
  description: "Unduh dokumen akademik, jadwal pelajaran, tata tertib, dan surat keputusan resmi sekolah.",
};

// Fetcher Server Side
async function getInitialDokumen() {
  // Panggil API diri sendiri (atau panggil DB langsung lebih baik jika satu project)
  // Disini kita fetch manual ke API route yang baru kita buat
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/public/dokumen?page=1`, {
    cache: "no-store" 
  });
  return res.json();
}

export default async function DokumenPage() {
  const initialData = await getInitialDokumen();

  return (
    <>
      <HeroPage title="Dokumen & Arsip Sekolah" />
      {/* Lempar data awal ke Client Component untuk Hydration */}
      <DokumenClient initialData={initialData} />
    </>
  );
}