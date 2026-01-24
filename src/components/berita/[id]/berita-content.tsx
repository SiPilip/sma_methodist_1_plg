"use client";

import { Container } from "@/components/container";
import Image from "next/image";
import Link from "next/link"; 
import { HiHome, HiChevronRight, HiHashtag } from "react-icons/hi2"; 
import BeritaShare from "./berita-share";
import BeritaAnother from "./berita-another";
import parse from 'html-react-parser';

interface ContentProps {
  data: any;       
  otherNews: any[]; 
}

export default function BeritaContent({ data, otherNews }: ContentProps) {
  const tags = data?.tags || ["Sekolah", "Pendidikan", "Update", data?.kategori || "Umum"];

  return (
    <section className="dark:bg-[#495A87] transisi min-h-screen">
      <Container className="py-10">
        
        {/* --- 1. BREADCRUMBS --- */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-300 mb-6 gap-2">
           <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
              <HiHome /> Beranda
           </Link>
           <HiChevronRight className="text-gray-400" />
           <Link href="/berita" className="hover:text-blue-600">
              Berita
           </Link>
           <HiChevronRight className="text-gray-400" />
           <span className="font-semibold text-blue-950 dark:text-white line-clamp-1 max-w-[200px]">
              {data?.judul}
           </span>
        </nav>

        {/* Gambar Utama */}
        <div className="relative h-64 lg:h-[500px] w-full mb-8 rounded-2xl overflow-hidden shadow-xl bg-gray-200">
          <Image
            src={data?.thumbnail || data?.thumbnail || "/img/bg-hero-page.png"}
            fill
            className="object-cover"
            alt={data?.judul || "Berita"}
            priority
          />
        </div>

        {/* Tombol Share */}
        <BeritaShare title={data?.judul} description={data?.konten} />

        <div className="lg:grid lg:grid-cols-5 gap-12 mt-8 items-start">
          
          {/* Kolom KIRI: Artikel */}
          <article className="lg:col-span-3 w-full min-w-0">
             
             {/* --- PERBAIKAN FINAL --- 
                1. break-words: Wajib ada agar teks tidak menabrak sidebar.
                2. hyphens-none: Mematikan pemenggalan kata otomatis (dih-arapkan).
                3. prose-p:text-justify: Rata kiri kanan.
             */}
             <div className="prose prose-slate prose-lg dark:prose-invert max-w-none w-full
                             break-words hyphens-none
                             prose-a:break-all
                             prose-p:text-justify prose-p:leading-loose 
                             prose-img:rounded-xl prose-a:text-blue-600 hover:prose-a:text-blue-500 transition-colors">
                {data?.konten ? parse(data.konten) : <p>Konten tidak tersedia.</p>}
             </div>

             {/* --- TAGS --- */}
             <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                   <HiHashtag /> Tags / Kata Kunci:
                </p>
                <div className="flex flex-wrap gap-2">
                   {tags.map((tag: string, idx: number) => (
                      <Link 
                        key={idx} 
                        href={`/berita?q=${tag}`} 
                        className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-200 text-sm rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                         #{tag}
                      </Link>
                   ))}
                </div>
             </div>
          </article>

          {/* Kolom KANAN: Sidebar */}
          <aside className="lg:col-span-2 lg:mt-0 mt-12 pl-0 lg:pl-4 border-l-0 lg:border-l border-gray-200 dark:border-white/10 sticky top-24">
            <BeritaAnother newsList={otherNews} />
          </aside>
          
        </div>
      </Container>
    </section>
  );
}