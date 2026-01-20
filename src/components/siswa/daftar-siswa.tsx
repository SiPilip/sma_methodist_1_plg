"use client";

import { useState, useEffect, useMemo } from "react";
import { HiMagnifyingGlass, HiChevronRight, HiFunnel } from "react-icons/hi2";
import { Container } from "../container";
import Link from "next/link";
import Pagination from "../pagination";

type Siswa = {
  nip: string;
  nama: string;
  kelas: string;
};

export default function DaftarSiswa() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua Kelas");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([...dummySiswa])
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Logic Filter & Pagination sama seperti sebelumnya
  const { paginatedItems, totalPages, uniqueClasses } = useMemo(() => {
    let filteredData = dummySiswa;

    if (selectedClass !== "Semua Kelas") {
      filteredData = filteredData.filter((item) => item.kelas === selectedClass);
      setFilteredData(filteredData);
    }

    if (debouncedQuery.length > 2) {
      const query = debouncedQuery.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.nama.toLowerCase().includes(query) ||
          item.nip.includes(query)
      );
      setFilteredData(filteredData);

    }

    const total = Math.ceil(filteredData.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginated = filteredData.slice(startIdx, startIdx + itemsPerPage);
    const classes = ["Semua Kelas", ...Array.from(new Set(dummySiswa.map(s => s.kelas))).sort()];

    return { paginatedItems: paginated, totalPages: total, uniqueClasses: classes };
  }, [debouncedQuery, currentPage, selectedClass]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setCurrentPage(1);
  }

  const handleClassClick = (e: React.MouseEvent, kelas: string) => {
    e.preventDefault(); // <--- KUNCI UTAMA: Stop navigasi ke halaman detail
    e.stopPropagation(); // Mencegah event bubbling
    setSelectedClass(kelas); // Set filter
    setCurrentPage(1); // Reset ke halaman 1
  };

  // --- STYLING YANG DIPERBAIKI (GAP KEMBALI MUNCUL) ---

  // 1. Header Cell Style (Warna di cell, bukan di row)
  const headerCellStyle =
    "bg-blue-950 text-white lg:font-semibold font-medium lg:py-3 lg:px-4 px-2 py-2 text-xs lg:text-base flex items-center h-full";

  // 2. Body Cell Style
  // Warna background diletakkan DISINI, bukan di Link wrapper.
  // Gunakan 'group-hover' agar warnanya berubah serentak saat baris disorot.
  const bodyCellStyle =
    "bg-[#DFEBF7] dark:bg-[#7184BF] group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors duration-200 w-full text-left lg:py-3 lg:px-4 p-2 text-black dark:text-white lg:text-base text-xs flex items-center h-full";

  // 3. Row Wrapper (Hanya layout grid & gap, TRANSPARAN)
  const rowWrapperStyle = 
    "grid lg:grid-cols-12 grid-cols-10 lg:gap-3 gap-1 mb-2 cursor-pointer group";

  return (
    <section className="dark:bg-[#495A87] bg-[#F1F2F4] transisi min-h-screen">
      <Container className="py-10">
        
        {/* HEADER CONTROLS (Search & Filter) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-950 dark:text-white">
              Data Siswa
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              Total {filteredData.length} siswa terdaftar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative min-w-[160px]">
              <select value={selectedClass} onChange={handleClassChange} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm cursor-pointer focus:ring-2 focus:ring-blue-950 dark:text-black">
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <div className="relative w-full lg:w-[300px]">
              <input type="text" placeholder="Cari Nama / NIP..." value={searchQuery} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-950 dark:text-black" />
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* --- TABEL STRUKTUR --- */}
        <div className="flex flex-col">
          
          {/* 1. HEADER ROW (Warna per cell, Gap dikendalikan Parent) */}
          <div className="grid lg:grid-cols-12 grid-cols-10 lg:gap-3 gap-1 mb-2 sticky top-0 z-10">
            {/* Perhatikan: class rounded hanya di ujung kiri/kanan */}
            <div className={`${headerCellStyle} lg:col-span-1 col-span-1 justify-center rounded-l-md`}>No</div>
            <div className={`${headerCellStyle} lg:col-span-3 col-span-3`}>NIP / NISN</div>
            <div className={`${headerCellStyle} lg:col-span-5 col-span-4`}>Nama Lengkap</div>
            <div className={`${headerCellStyle} lg:col-span-2 col-span-2`}>Kelas</div>
            <div className={`${headerCellStyle} lg:col-span-1 hidden lg:flex justify-center rounded-r-md`}>Detail</div>
          </div>

          {/* 2. BODY ROWS */}
          <div className="flex flex-col">
      {paginatedItems.length > 0 ? (
        paginatedItems.map((item, index) => (
          <Link
            href={`/siswa/${item.nip}`}
            key={item.nip}
            className={rowWrapperStyle}
          >
            {/* CELL: No */}
            <div className={`${bodyCellStyle} lg:col-span-1 col-span-1 justify-center font-semibold opacity-70 rounded-l-md`}>
              {(currentPage - 1) * itemsPerPage + index + 1}
            </div>

            {/* CELL: NIP */}
            <div className={`${bodyCellStyle} lg:col-span-3 col-span-3 font-mono text-sm`}>
              {item.nip}
            </div>

            {/* CELL: Nama */}
            <div className={`${bodyCellStyle} lg:col-span-5 col-span-4 font-semibold capitalize`}>
              {item.nama}
            </div>

            {/* CELL: Kelas (MODIFIKASI DISINI) */}
            <div className={`${bodyCellStyle} lg:col-span-2 col-span-2`}>
              {/* Ubah span biasa menjadi elemen interaktif */}
              <button
                onClick={(e) => handleClassClick(e, item.kelas)}
                className="
                  bg-white/50 border border-blue-200 dark:border-blue-900 dark:bg-blue-900
                  text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded text-xs font-bold 
                  hover:bg-blue-600 hover:text-white hover:border-blue-600 
                  dark:hover:bg-blue-500 dark:hover:text-white
                  transition-all duration-200 cursor-pointer z-10 relative
                "
              >
                {item.kelas}
              </button>
            </div>

            {/* CELL: Action */}
            <div className={`${bodyCellStyle} lg:col-span-1 hidden lg:flex justify-center rounded-r-md`}>
              <HiChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 dark:text-white transition-colors" />
            </div>
          </Link>
        ))
            ) : (
              // Empty State
              <div className="py-12 flex flex-col items-center justify-center text-gray-500 italic bg-white dark:bg-transparent rounded-lg dark:text-white">
                 <HiMagnifyingGlass size={40} className="mb-2 opacity-50"/>
                <p>Tidak ada data siswa.</p>
              </div>
            )}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Container>
    </section>
  );
}

const dummySiswa: Siswa[] = Array.from({ length: 50 }).map((_, i) => ({
  nip: `2024${String(i + 1).padStart(4, "0")}`,
  nama: `Siswa ${i + 1}`,
  kelas: ["X-A", "X-B", "XI-IPA 1", "XII-IPA 1"][Math.floor(Math.random() * 4)],
}));