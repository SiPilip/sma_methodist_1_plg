"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiMagnifyingGlass, HiChevronRight, HiFunnel, HiXCircle } from "react-icons/hi2";
import { Container } from "../container";
import Link from "next/link";
import Pagination from "../pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { ISiswa } from "@/models/Siswa"; // Impor interface dari model

// --- INTERFACES ---
interface ISiswaWithKelas extends ISiswa {
  kelas: string;
}

interface IApiResponse {
  success: boolean;
  data: ISiswaWithKelas[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// --- CONSTANTS ---
const JURUSAN_OPTIONS = ["Semua Jurusan", "MIPA", "IPS"];
const ANGKATAN_OPTIONS = ["Semua Angkatan", ...Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)];


// --- API FETCHER ---
const fetchSiswa = async (query: string, jurusan: string, angkatan: string, page: number): Promise<IApiResponse> => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (jurusan && jurusan !== "Semua Jurusan") params.append("jurusan", jurusan);
  if (angkatan && angkatan !== "Semua Angkatan") params.append("angkatan", angkatan);
  if (page) params.append("page", String(page));

  const response = await fetch(`/api/public/siswa?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data siswa");
  }
  return response.json();
};

export default function DaftarSiswa() {
  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("Semua Jurusan");
  const [selectedAngkatan, setSelectedAngkatan] = useState("Semua Angkatan");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedQuery = useDebounce(searchQuery, 500);

  // --- DATA FETCHING with React Query ---
  const { data, isLoading, isError, error } = useQuery<IApiResponse, Error>({
    queryKey: ["siswa", debouncedQuery, selectedJurusan, selectedAngkatan, currentPage],
    queryFn: () => fetchSiswa(debouncedQuery, selectedJurusan, selectedAngkatan, currentPage),
    keepPreviousData: true, // Untuk pengalaman paginasi yang lebih baik
  });

  // --- HANDLERS ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset halaman saat query berubah
  };
  const handleJurusanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJurusan(e.target.value);
    setCurrentPage(1);
  };
    const handleAngkatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAngkatan(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedJurusan("Semua Jurusan");
    setSelectedAngkatan("Semua Angkatan");
    setCurrentPage(1);
  };


  // --- UI STYLES ---
  const headerCellStyle = "bg-blue-950 text-white lg:font-semibold font-medium lg:py-3 lg:px-4 px-2 py-2 text-xs lg:text-base flex items-center h-full";
  const bodyCellStyle = "bg-[#DFEBF7] dark:bg-[#7184BF] group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors duration-200 w-full text-left lg:py-3 lg:px-4 p-2 text-black dark:text-white lg:text-base text-xs flex items-center h-full";
  const rowWrapperStyle = "grid lg:grid-cols-12 grid-cols-10 lg:gap-3 gap-1 mb-2 cursor-pointer group";

  return (
    <section className="dark:bg-[#495A87] bg-[#F1F2F4] transisi min-h-screen">
      <Container className="py-10">
        
        {/* HEADER CONTROLS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950 dark:text-white">
              Data Siswa
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              Total {data?.pagination.totalItems || 0} siswa terdaftar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Filter Jurusan */}
            <div className="relative min-w-[160px]">
              <select value={selectedJurusan} onChange={handleJurusanChange} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer focus:ring-2 focus:ring-blue-950 dark:text-black">
                {JURUSAN_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
              <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            {/* Filter Angkatan */}
            <div className="relative min-w-[160px]">
              <select value={selectedAngkatan} onChange={handleAngkatanChange} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer focus:ring-2 focus:ring-blue-950 dark:text-black">
                {ANGKATAN_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            {/* Search Input */}
            <div className="relative w-full lg:w-[300px]">
              <input type="text" placeholder="Cari Nama / NISN..." value={searchQuery} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-950 dark:text-black" />
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="flex flex-col">
          <div className="grid lg:grid-cols-12 grid-cols-10 lg:gap-3 gap-1 mb-2 sticky top-0 z-10">
            <div className={`${headerCellStyle} lg:col-span-1 col-span-1 justify-center rounded-l-md`}>No</div>
            <div className={`${headerCellStyle} lg:col-span-3 col-span-3`}>NISN</div>
            <div className={`${headerCellStyle} lg:col-span-5 col-span-4`}>Nama Lengkap</div>
            <div className={`${headerCellStyle} lg:col-span-2 col-span-2`}>Kelas</div>
            <div className={`${headerCellStyle} lg:col-span-1 hidden lg:flex justify-center rounded-r-md`}>Detail</div>
          </div>

          <div className="flex flex-col">
            {isLoading ? (
              <div className="py-12 flex items-center justify-center text-gray-500 italic">Memuat data...</div>
            ) : isError ? (
              <div className="py-12 flex flex-col items-center justify-center text-red-500 italic">
                <HiXCircle size={40} className="mb-2"/>
                <p>Error: {error.message}</p>
              </div>
            ) : data && data.data.length > 0 ? (
              data.data.map((item, index) => (
                <Link href={`/siswa/${item.nisn}`} key={item.nisn} className={rowWrapperStyle}>
                  <div className={`${bodyCellStyle} lg:col-span-1 col-span-1 justify-center font-semibold opacity-70 rounded-l-md`}>
                    {(currentPage - 1) * 12 + index + 1}
                  </div>
                  <div className={`${bodyCellStyle} lg:col-span-3 col-span-3 font-mono text-sm`}>{item.nisn}</div>
                  <div className={`${bodyCellStyle} lg:col-span-5 col-span-4 font-semibold capitalize`}>{item.nama.toLowerCase()}</div>
                  <div className={`${bodyCellStyle} lg:col-span-2 col-span-2`}>
                     <span className="bg-white/50 border border-blue-200 dark:border-blue-900 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded text-xs font-bold">
                        {item.kelas}
                     </span>
                  </div>
                  <div className={`${bodyCellStyle} lg:col-span-1 hidden lg:flex justify-center rounded-r-md`}>
                    <HiChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 dark:text-white transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500 italic bg-white dark:bg-transparent rounded-lg dark:text-white">
                <HiMagnifyingGlass size={40} className="mb-2 opacity-50"/>
                <p>Tidak ada data siswa yang cocok dengan filter.</p>
                 <button onClick={clearFilters} className="mt-4 text-sm text-blue-600 dark:text-blue-300 hover:underline">
                    Hapus Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PAGINATION */}
        {data && data.pagination.totalPages > 1 && (
            <div className="mt-6">
            <Pagination 
                currentPage={currentPage} 
                totalPages={data.pagination.totalPages} 
                onPageChange={setCurrentPage} 
            />
            </div>
        )}
      </Container>
    </section>
  );
}