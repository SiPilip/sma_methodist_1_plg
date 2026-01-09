"use client";

import { useState, useEffect, useMemo } from "react";
import { HiArrowDownOnSquare, HiMagnifyingGlass } from "react-icons/hi2";
import { Container } from "../container";
import Link from "next/link";
import Pagination from "../pagination"; // Pastikan import ini benar

export default function Dokumen() {
  // --- STYLING ASLI (TIDAK DIUBAH) ---
  const headerStyle =
    "bg-blue-950 w-full text-left lg:font-semibold font-medium lg:py-2 lg:px-4 px-1 py-2 text-white lg:text-base text-xs  flex items-center";
  const bodyStyle =
    "bg-[#DFEBF7] dark:bg-[#7184BF] w-full text-left lg:py-2 lg:px-4 p-1 text-black dark:text-white text-wrap lg:text-base text-xs flex items-center";

  // --- LOGIC SEARCH & PAGINATION ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Tampilkan 5 per halaman

  // 1. Debounce Effect (1 Detik)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Filter & Pagination Data
  const { paginatedItems, totalPages } = useMemo(() => {
    let filteredData = dataDummy;

    // Filter Search (Minimal 3 huruf)
    if (debouncedQuery.length > 2) {
      const query = debouncedQuery.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.deskripsi.toLowerCase().includes(query)
      );
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredData.slice(
      startIdx,
      startIdx + itemsPerPage
    );

    return { paginatedItems, totalPages };
  }, [debouncedQuery, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <section className="dark:bg-[#495A87] bg-[#F1F2F4] transisi min-h-screen">
      <Container className="py-10">
        {/* --- SEARCH BAR (Baru) --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-5 gap-4">
          <h2 className="hidden md:block text-2xl font-bold text-blue-950 dark:text-white">
            Dokumen
          </h2>
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Cari dokumen... (min. 3 huruf)"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-white/30 bg-white dark:bg-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-950 placeholder:text-gray-400 dark:placeholder:text-gray-200 text-sm"
            />
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-200" />
            {searchQuery !== debouncedQuery && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                Loading...
              </span>
            )}
          </div>
        </div>

        {/* --- TABEL STRUKTUR ASLI --- */}
        <div className="flex flex-col gap-2">
          {/* HEADER */}
          <div className="grid lg:grid-cols-12 grid-cols-9 lg:gap-3 gap-1">
            <div
              className={`${headerStyle} lg:col-span-1 col-span-1 justify-center`}
            >
              No
            </div>
            <div className={`${headerStyle} lg:col-span-3 col-span-2`}>
              Judul Dokumen
            </div>
            <div className={`${headerStyle} lg:col-span-4 col-span-2`}>
              Deskripsi
            </div>
            <div className={`${headerStyle} lg:col-span-2 col-span-2`}>
              Tanggal Unggah
            </div>
            <div className={`${headerStyle} lg:col-span-2 col-span-2`}>
              Link
            </div>
          </div>

          {/* BODY (List Item) */}
          <div className="flex flex-col gap-2">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => (
                <div
                  className="grid lg:grid-cols-12 grid-cols-9 lg:gap-3 gap-1"
                  key={index}
                >
                  <div
                    className={`${bodyStyle} lg:col-span-1 col-span-1 justify-center`}
                  >
                    {/* Perbaikan Nomor Urut agar continue antar page */}
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </div>
                  <div className={`${bodyStyle} lg:col-span-3 col-span-2`}>
                    {item.title}
                  </div>
                  <div className={`${bodyStyle} lg:col-span-4 col-span-2`}>
                    {item.deskripsi}
                  </div>
                  <div className={`${bodyStyle} lg:col-span-2 col-span-2`}>
                    {item.tanggal_unggah}
                  </div>
                  <div className={`${bodyStyle} lg:col-span-2 col-span-2`}>
                    <Link
                      href={item.url}
                      className="flex gap-2 items-center underline underline-offset-3"
                    >
                      <HiArrowDownOnSquare />
                      Unduh
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              /* Empty State jika search tidak ketemu */
              <div className="py-10 text-center text-gray-500 dark:text-gray-200 italic bg-white/50 dark:bg-black/10 rounded-lg">
                Tidak ada dokumen yang ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* --- PAGINATION COMPONENT (Baru) --- */}
        {/* Menggantikan navigasi manual sebelumnya */}
        <div className="mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </Container>
    </section>
  );
}

// --- DUMMY DATA (Diperbanyak agar pagination muncul) ---
const dataDummy = Array.from({ length: 35 }).map((_, i) => ({
  title: `Dokumen Sekolah - Bagian ${i + 1}`,
  deskripsi: `Deskripsi lengkap untuk dokumen nomor ${i + 1}.`,
  tanggal_unggah: "2025-01-01",
  url: `/dokumen/dokumen-${i + 1}`,
}));
