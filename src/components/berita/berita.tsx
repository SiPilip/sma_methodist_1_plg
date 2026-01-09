"use client";

import Image from "next/image";
import { Container } from "../container"; // Sesuaikan path import
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Pagination from "../pagination"; // Import komponen Pagination
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const newsCategory = ["semua", "kegiatan", "prestasi", "pengumuman", "lomba"];

export default function BeritaList() {
  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Tampilkan 5 berita per halaman

  // --- 1. LOGIKA DEBOUNCING (Delay 1 Detik) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- 2. LOGIKA FILTERING & PAGINATION ---
  const { paginatedItems, totalPages, totalItems } = useMemo(() => {
    let filteredData = dummyNews;

    // A. Filter Search (Hanya jika > 2 huruf)
    if (debouncedQuery.length > 2) {
      const query = debouncedQuery.toLowerCase();
      filteredData = filteredData.filter((item) => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
        );
      });
    }

    // B. Filter Kategori
    if (selectedCategory !== "semua") {
      filteredData = filteredData.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // C. Pagination Slicing
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredData.slice(
      startIdx,
      startIdx + itemsPerPage
    );

    return {
      paginatedItems,
      totalPages,
      totalItems: filteredData.length,
    };
  }, [debouncedQuery, selectedCategory, currentPage]);

  // --- HANDLERS ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset ke halaman 1 saat mengetik
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset ke halaman 1 saat ganti kategori
  };

  const router = useRouter();

  return (
    <section className="dark:bg-[#495A87] transition-colors min-h-screen">
      <Container className="py-10">
        {/* --- HEADER CONTROL (Search & Kategori) --- */}
        <div className="flex flex-col gap-6 mb-10">
          {/* Search Bar */}
          <div className="relative">
            <Input
              placeholder="Cari berita... (min. 3 huruf)"
              className="w-full pl-4 pr-10 py-6 text-base rounded-xl border-gray-300 dark:border-white/30 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-300 focus:ring-2 focus:ring-blue-950 transition-all"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {/* Loading Indicator / Search Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-200">
              {searchQuery !== debouncedQuery ? (
                <span className="animate-spin inline-block">⏳</span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              )}
            </div>
          </div>

          {/* Kategori Badges */}
          <div className="flex gap-2 flex-wrap">
            {newsCategory.map((item, index) => (
              <Badge
                key={"badge-search-" + index}
                className={cn(
                  "px-4 py-2 rounded-full capitalize border border-blue-950 dark:border-white cursor-pointer text-sm transition-all duration-300 hover:shadow-md",
                  selectedCategory === item
                    ? "bg-blue-950 text-white dark:bg-white dark:text-blue-950" // Aktif
                    : "bg-transparent text-blue-950 dark:text-white hover:bg-blue-950 hover:text-white dark:hover:bg-white/20" // Tidak Aktif
                )}
                onClick={() => handleCategoryChange(item)}
              >
                {item}
              </Badge>
            ))}
          </div>

          {/* Info Hasil Pencarian */}
          <div className="text-sm text-gray-500 dark:text-gray-300 italic">
            Menampilkan {totalItems} berita
            {selectedCategory !== "semua" &&
              ` di kategori "${selectedCategory}"`}
            {debouncedQuery.length > 2 &&
              ` untuk pencarian "${debouncedQuery}"`}
          </div>
        </div>

        {/* --- LIST BERITA --- */}
        <div className="flex flex-col gap-6">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => (
              <div
                className="group flex flex-col md:flex-row items-stretch bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-transparent hover:border-blue-950/20 transition-all duration-300 cursor-pointer"
                key={item.id}
                onClick={() => router.push(`/berita/${item.id}`)} // Aktifkan jika sudah ada routing
              >
                {/* Gambar Berita */}
                <div className="relative w-full md:w-4/12 h-48 md:h-auto overflow-hidden bg-gray-200">
                  <Image
                    src={item.image || "/img/tentang-kami.png"} // Fallback image
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Konten Berita */}
                <div className="w-full md:w-8/12 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {item.category}
                    </Badge>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      {item.date}
                    </p>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-950 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="text-center py-20 text-gray-400 dark:text-gray-300">
              <p className="text-lg">Berita tidak ditemukan.</p>
              <p className="text-sm">Coba ubah kata kunci atau kategori.</p>
            </div>
          )}
        </div>

        {/* --- PAGINATION --- */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Container>
    </section>
  );
}

// --- DUMMY DATA YANG DIPERBANYAK ---
// Menggunakan Array.from untuk membuat data dummy yang cukup banyak agar pagination muncul
const baseNews = [
  {
    title: "Siswa Methodist Juara Olimpiade Matematika",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Prestasi membanggakan kembali diraih...",
    category: "Prestasi",
  },
  {
    title: "Kegiatan Bakti Sosial Tahunan",
    content:
      "Sekolah mengadakan kegiatan bakti sosial ke panti asuhan terdekat sebagai bentuk kepedulian...",
    category: "Kegiatan",
  },
  {
    title: "Pengumuman Libur Semester Ganjil",
    content:
      "Diberitahukan kepada seluruh siswa bahwa libur semester akan dimulai pada tanggal...",
    category: "Pengumuman",
  },
  {
    title: "Lomba Kebersihan Kelas",
    content:
      "Dalam rangka hari kemerdekaan, sekolah mengadakan lomba kebersihan antar kelas...",
    category: "Lomba",
  },
  {
    title: "Kunjungan Studi Banding dari Sekolah Lain",
    content:
      "Menerima kunjungan dari SMA X dalam rangka studi banding kurikulum...",
    category: "Kegiatan",
  },
];

const dummyNews = Array.from({ length: 30 }).map((_, i) => {
  const base = baseNews[i % baseNews.length];
  return {
    id: `news-${i}`,
    title: `${base.title} (Part ${i + 1})`,
    content: base.content + " " + "Lorem ipsum dolor sit amet ".repeat(10),
    date: `${(i % 30) + 1} Agustus 2025`,
    category: base.category,
    image: "/img/tentang-kami.png", // Ganti dengan path gambar kamu
  };
});
