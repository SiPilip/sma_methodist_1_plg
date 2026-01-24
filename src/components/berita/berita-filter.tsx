"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HiMagnifyingGlass } from "react-icons/hi2";

const categories = ["Semua", "Berita", "Artikel", "Pengumuman", "Prestasi", "Kegiatan"];

export default function BeritaFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil nilai awal dari URL agar sinkron saat refresh
  const initialSearch = searchParams.get("q") || "";
  const initialCategory = searchParams.get("kategori") || "Semua";

  // State Lokal
  const [text, setText] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // 1. Logic Debounce (Delay pencarian agar tidak berat)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(text);
    }, 500); // Delay 0.5 detik

    return () => clearTimeout(timer);
  }, [text]);

  // 2. Logic Update URL (INI YANG KITA PERBAIKI)
  useEffect(() => {
    // Cek nilai di URL saat ini
    const currentQ = searchParams.get("q") || "";
    const currentCategory = searchParams.get("kategori") || "Semua";

    // PENTING: Cek apakah state local BERBEDA dengan URL?
    // Jika sama, berarti user cuma ganti page (atau baru load), jadi JANGAN reset page.
    const isSearchChanged = debouncedQuery !== currentQ;
    const isCategoryChanged = activeCategory !== currentCategory;

    if (!isSearchChanged && !isCategoryChanged) {
      return; // Stop di sini, jangan ganggu URL
    }

    // Jika sampai sini, berarti User MEMANG mengetik search baru atau ganti kategori
    const params = new URLSearchParams(searchParams.toString());
    
    // Set Search Query
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }

    // Set Kategori
    if (activeCategory && activeCategory !== "Semua") {
      params.set("kategori", activeCategory);
    } else {
      params.delete("kategori");
    }

    // Reset ke halaman 1 HANYA jika filter berubah
    params.set("page", "1");

    router.push(`/berita?${params.toString()}`);
    
  }, [debouncedQuery, activeCategory, router, searchParams]);

  return (
    <div className="flex flex-col gap-6 mb-10">
      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Cari berita..."
          className="w-full pl-12 pr-4 py-6 text-base rounded-xl border-gray-300 dark:border-white/20 dark:bg-white/5 dark:text-white focus:ring-2 focus:ring-blue-900 transition-all"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
      </div>

      {/* Kategori Badges */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Badge
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-full cursor-pointer text-sm font-medium transition-all border border-blue-950 dark:border-white/20 hover:scale-105",
              activeCategory === cat || (cat === "Semua" && !activeCategory)
                ? "bg-blue-950 text-white dark:bg-white dark:text-blue-950"
                : "bg-transparent text-blue-950 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10"
            )}
          >
            {cat}
          </Badge>
        ))}
      </div>
    </div>
  );
}