"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Container } from "../container"; // Sesuaikan path import
import Pagination from "../pagination"; // Sesuaikan path import
import defaultProfilePicture from "@/../public/img/blank-profile-picture.webp";
import { useRouter } from "next/navigation";

// Tipe data
type StaffProfile = {
  uuid: string;
  nama: string;
  nip: string;
  jabatan: string;
  matapelajaran: string;
  kategori: "Guru" | "Karyawan";
  foto?: string;
};

export default function DaftarGuruKaryawan() {
  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState(""); // Nilai input langsung
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Nilai setelah delay (untuk filter)
  const [categoryFilter, setCategoryFilter] = useState<"Guru" | "Karyawan">(
    "Guru"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  // --- 1. LOGIKA DEBOUNCING (Delay 1 Detik) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // Tunggu 1000ms (1 detik) sebelum update debouncedQuery

    return () => clearTimeout(timer); // Cleanup jika user mengetik lagi
  }, [searchQuery]);

  // --- 2. LOGIKA FILTERING & PAGINATION ---
  const { paginatedItems, totalPages, crossCategoryCount } = useMemo(() => {
    let allMatches = gurukaryawan; // Default: Ambil semua data

    // Hanya filter jika query yang SUDAH DI-DEBOUNCE > 2 karakter
    if (debouncedQuery.length > 2) {
      const query = debouncedQuery.toLowerCase();

      allMatches = gurukaryawan.filter((item) => {
        return (
          item.nama.toLowerCase().includes(query) ||
          item.nip.toLowerCase().includes(query) ||
          item.matapelajaran.toLowerCase().includes(query) ||
          item.jabatan.toLowerCase().includes(query)
        );
      });
    }

    // Pisahkan hasil berdasarkan kategori saat ini
    const currentCategoryItems = allMatches.filter(
      (item) => item.kategori === categoryFilter
    );

    // Cek apakah ada hasil di kategori SEBALIKNYA (untuk fitur alert)
    const otherCategoryItems = allMatches.filter(
      (item) => item.kategori !== categoryFilter
    );

    // Hitung Pagination
    const totalPages = Math.ceil(currentCategoryItems.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedItems = currentCategoryItems.slice(
      startIdx,
      startIdx + itemsPerPage
    );

    return {
      paginatedItems,
      totalPages,
      crossCategoryCount: otherCategoryItems.length,
    };
  }, [debouncedQuery, categoryFilter, currentPage]); // Dependency ke debouncedQuery

  // --- HANDLERS ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update tampilan input instan
    setCurrentPage(1); // Reset halaman ke 1 saat mengetik
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value as "Guru" | "Karyawan");
    setCurrentPage(1);
  };

  return (
    <section
      id="daftar-guru"
      className="flex flex-col gap-5 bg-white dark:bg-[#495A87] transition-colors py-10 min-h-screen"
    >
      <Container className="px-4">
        {/* --- CONTROL BAR --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
          {/* Search Input */}
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Cari NIP, Nama, Mapel, atau Jabatan... (min. 3 huruf)"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
            <div className="absolute right-3 top-3.5 text-gray-400">
              {/* Indikator Loading sederhana saat mengetik */}
              {searchQuery !== debouncedQuery ? (
                <span className="animate-spin inline-block">⏳</span>
              ) : (
                "🔍"
              )}
            </div>
          </div>

          {/* Dropdown Kategori */}
          <div className="w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="w-full h-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer appearance-none"
            >
              <option value="Guru">Guru</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>
        </div>

        {/* --- ALERT CROSS-CATEGORY --- */}
        {/* Hanya muncul jika hasil pencarian > 2 huruf valid dan ada hasil di kategori lain */}
        {debouncedQuery.length > 2 &&
          crossCategoryCount > 0 &&
          paginatedItems.length === 0 && (
            <div
              onClick={() =>
                setCategoryFilter(
                  categoryFilter === "Guru" ? "Karyawan" : "Guru"
                )
              }
              className="mb-6 p-4 bg-blue-50 border-l-4 border-slate-400 text-blue-950 rounded-r shadow-sm cursor-pointer hover:bg-blue-100 transition-colors flex justify-between items-center"
            >
              <div>
                <span className="font-bold">Info: </span>
                Tidak ditemukan di {categoryFilter}, tapi ada{" "}
                {crossCategoryCount} hasil di{" "}
                <span className="font-bold">
                  {categoryFilter === "Guru" ? "Karyawan" : "Guru"}
                </span>
              </div>
              <button className="text-sm underline text-blue-900 font-semibold">
                Lihat →
              </button>
            </div>
          )}

        {/* --- GRID RESULT --- */}
        {paginatedItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedItems.map((item) => (
              <div
                key={item.uuid}
                className="flex flex-col items-center text-center bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-xl border-b-[8px] border-blue-950 dark:border-slate-500 overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                onClick={() =>
                  router.push(`/daftar-guru-karyawan/${item.uuid}`)
                }
              >
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden shadow-sm border-2 border-gray-100 dark:border-slate-600">
                  <Image
                    src={item?.foto || defaultProfilePicture}
                    alt={item?.nama || "Foto"}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-base font-bold text-[#1F263E] dark:text-white mb-1 line-clamp-1">
                  {item.nama}
                </h3>

                <p className="text-[10px] text-gray-400 mb-2 font-mono bg-gray-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                  {item.nip}
                </p>

                <p className="text-xs font-semibold text-[#7582C2] mb-1 uppercase tracking-wide">
                  {item.jabatan}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5em]">
                  {item.matapelajaran}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-white/80">
            <p className="text-xl font-semibold">Tidak ditemukan hasil</p>
            <p className="text-sm mt-2">
              {debouncedQuery.length > 0 && debouncedQuery.length <= 2
                ? "Ketik minimal 3 huruf untuk mencari..."
                : "Coba kata kunci lain atau cek kategori sebelah."}
            </p>
          </div>
        )}

        {/* --- PAGINATION --- */}
        {paginatedItems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Container>
    </section>
  );
}

// --- MOCK DATA ---
const gurukaryawan: StaffProfile[] = [
  {
    uuid: "oliver-granli",
    nama: "Oliver Granli",
    nip: "198001012005011001",
    jabatan: "Guru Tetap",
    matapelajaran: "Matematika",
    kategori: "Guru",
  },
  {
    uuid: "a2",
    nama: "Siti Aminah",
    nip: "198502022010012002",
    jabatan: "Guru Honorer",
    matapelajaran: "Bahasa Indonesia",
    kategori: "Guru",
  },
  {
    uuid: "b1",
    nama: "Joko Anwar",
    nip: "199003032015011003",
    jabatan: "Staff TU",
    matapelajaran: "Administrasi",
    kategori: "Karyawan",
  },
  // ... Tambahkan data dummy lainnya di sini sesuai kebutuhan
  ...Array.from({ length: 300 }).map((_, i) => ({
    uuid: `dummy-guru-${i}`,
    nama: `Guru Dummy ${i + 1}`,
    nip: `1980000000${i}`,
    jabatan: "Pengajar",
    matapelajaran: "Fisika",
    kategori: "Guru" as const,
  })),
];
