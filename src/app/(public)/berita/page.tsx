import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import connectDB from "@/lib/db";
import BeritaModel from "@/models/Berita";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import BeritaFilter from "@/components/berita/berita-filter";
import parse from 'html-react-parser';

// GANTI IMPORT INI:
import BeritaPagination from "@/components/berita/berita-pagination"; 

export const metadata: Metadata = {
  title: "Arsip Berita & Artikel - SMA Methodist 1 Palembang",
  description: "Kumpulan berita terbaru, prestasi siswa, dan pengumuman sekolah.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    kategori?: string;
    page?: string;
  }>;
}

export default async function BeritaPage({ searchParams }: PageProps) {
  await connectDB();
  
  // 1. Ambil Parameter URL
  const { q, kategori, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 6; // Jumlah berita per halaman
  const skip = (currentPage - 1) * limit;

  // 2. Buat Query Database
  const query: any = { status: "Published" };

  if (q) {
    query.$or = [
      { judul: { $regex: q, $options: "i" } },
      { konten: { $regex: q, $options: "i" } },
    ];
  }

  if (kategori && kategori !== "Semua") {
    query.kategori = { $regex: new RegExp(`^${kategori}$`, "i") };
  }

  // 3. Eksekusi Query
  const [berita, totalBerita] = await Promise.all([
    BeritaModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BeritaModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalBerita / limit);

  return (
    <>
      {/* Header Statis */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image
           src="/img/bg-hero-page.png" 
           fill 
           className="object-cover" 
           alt="Header Berita"
        />
        <div className="absolute inset-0 bg-[#2E3853]/80 flex items-center justify-center">
           <h1 className="text-4xl font-bold text-white uppercase tracking-wider">Arsip Berita</h1>
        </div>
      </div>

      <section className="dark:bg-[#495A87] min-h-screen py-12 transition-colors">
        <Container>
          
          {/* Filter Component */}
          <BeritaFilter />

          {/* List Berita */}
          <div className="grid grid-cols-1 gap-6">
            {berita.length > 0 ? (
              berita.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/berita/${item.slug}`}
                  className="group flex flex-col md:flex-row items-stretch bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-transparent hover:border-blue-950/20 dark:hover:border-white/20 transition-all duration-300"
                >
                  <div className="relative w-full md:w-4/12 h-56 md:h-auto overflow-hidden bg-gray-200">
                    <Image
                      src={item.thumbnail || "/img/bg-hero-page.png"}
                      alt={item.judul}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="w-full md:w-8/12 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 hover:bg-blue-200 border-none">
                        {item.kategori}
                      </Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-400 font-medium">
                        {item.createdAt ? format(new Date(item.createdAt), "dd MMMM yyyy", { locale: id }) : "-"}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                      {item.judul}
                    </h3>

                    <div className="prose prose-slate prose-lg dark:prose-invert max-w-none w-full
                             break-words hyphens-none
                             prose-a:break-all
                             prose-p:text-justify prose-p:leading-loose 
                             prose-img:rounded-xl prose-a:text-blue-600 hover:prose-a:text-blue-500 transition-colors text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                {item?.konten ? parse(item.konten) : <p>Konten tidak tersedia.</p>}
             </div>

                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
                <p className="text-xl font-bold text-gray-400 dark:text-gray-300">Berita tidak ditemukan</p>
                <p className="text-gray-500">Coba kata kunci lain atau ubah kategori.</p>
              </div>
            )}
          </div>

          {/* Pagination Component (Wrapper) */}
          {/* Komponen ini akan me-render Pagination.tsx Anda */}
          <BeritaPagination currentPage={currentPage} totalPages={totalPages} />
          
        </Container>
      </section>
    </>
  );
}