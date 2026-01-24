"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Container } from "../container";
import Pagination from "../pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { IGuru } from "@/models/Guru";

import defaultProfilePicture from "@/../public/img/blank-profile-picture.webp";

// Fungsi untuk fetch data ke API
async function getGurus(
  query: string,
  kategori: string,
  page: number,
  limit: number
) {
  const params = new URLSearchParams({
    q: query,
    kategori: kategori,
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(`/api/public/guru?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Gagal mengambil data guru");
  }
  return res.json();
}

export default function DaftarGuruKaryawan() {
  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"Guru" | "Karyawan" | "">(
    "Guru"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Sesuaikan dengan limit di API

  const router = useRouter();

  // --- DEBOUNCING ---
  const debouncedQuery = useDebounce(searchQuery, 500); // Delay 500ms

  // --- DATA FETCHING (Tanstack Query) ---
  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["gurus", debouncedQuery, categoryFilter, currentPage],
    queryFn: () =>
      getGurus(debouncedQuery, categoryFilter, currentPage, itemsPerPage),
    keepPreviousData: true, // Untuk UX yang lebih baik saat paginasi
  });

  const gurus: IGuru[] = result?.data || [];
  const totalPages = result?.pagination?.totalPages || 0;

  // --- HANDLERS ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset halaman ke 1 saat mulai mencari
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoryFilter(e.target.value as "Guru" | "Karyawan" | "");
    setCurrentPage(1); // Reset halaman ke 1 saat ganti kategori
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
              placeholder="Cari NIP, Nama, atau Jabatan..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
            <div className="absolute right-3 top-3.5 text-gray-400">
              {isLoading ? (
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
              className="w-full h-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer"
            >
              <option value="Guru">Guru</option>
              <option value="Karyawan">Karyawan</option>
              <option value="">Semua</option>
            </select>
          </div>
        </div>

        {/* --- GRID RESULT --- */}
        {isLoading && (
          <div className="text-center p-10">Memuat data...</div>
        )}

        {!isLoading && isError && (
          <div className="text-center p-10 text-red-500">
            Terjadi kesalahan saat memuat data.
          </div>
        )}

        {!isLoading && !isError && gurus.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {gurus.map((item) => (
              <div
                key={item._id as string}
                className="flex flex-col items-center text-center bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-xl border-b-[8px] border-blue-950 dark:border-slate-500 overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                onClick={() =>
                  router.push(`/guru-karyawan/${item._id}`)
                }
              >
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden shadow-sm border-2 border-gray-100 dark:border-slate-600">
                  <Image
                    src={item?.foto || defaultProfilePicture}
                    alt={item?.nama || "Foto"}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                    unoptimized // Tambahkan ini jika `item.foto` adalah URL eksternal atau path absolut
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
                  {item.mataPelajaran || ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && !isError && (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-white/80">
              <p className="text-xl font-semibold">Tidak ditemukan hasil</p>
              <p className="text-sm mt-2">
                Coba ubah kata kunci pencarian atau filter kategori Anda.
              </p>
            </div>
          )
        )}

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
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
