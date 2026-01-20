"use client";

import { useState } from "react";
import { 
  HiMagnifyingGlass, 
  HiFunnel, 
  HiPlus, 
  HiPencilSquare, 
  HiTrash,
  HiEye,
  HiCalendarDays
} from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";

// 1. Tipe Data Dummy
type Article = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: "Published" | "Draft";
  views: number;
  image: string; // URL gambar dummy
};

// 2. Data Dummy
const initialArticles: Article[] = [
  {
    id: "1",
    title: "Perayaan Natal Sekolah 2025 Berlangsung Meriah",
    category: "Kegiatan",
    author: "Admin Utama",
    date: "2025-12-25",
    status: "Published",
    views: 1240,
    image: "/img/kegiatan-1.jpg" // Pastikan ada gambar dummy atau ganti link eksternal
  },
  {
    id: "2",
    title: "Prestasi Siswa: Juara 1 Olimpiade Matematika Nasional",
    category: "Prestasi",
    author: "Oliver Granli",
    date: "2025-11-10",
    status: "Published",
    views: 856,
    image: "/img/prestasi.jpg"
  },
  {
    id: "3",
    title: "Jadwal Ujian Akhir Semester Ganjil 2025/2026",
    category: "Pengumuman",
    author: "Bagian Kurikulum",
    date: "2025-11-01",
    status: "Draft", // Masih konsep
    views: 0,
    image: "/img/pengumuman.jpg"
  },
];

export default function AdminBeritaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Logic Filter
  const filteredData = initialArticles.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "Semua" ? true : item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Berita & Artikel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola konten blog, pengumuman, dan update kegiatan sekolah.
          </p>
        </div>
        <Link 
          href="/admin/berita/tambah" // Nanti kita buat halaman editornya
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <HiPlus size={20} />
          Tulis Berita
        </Link>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari Judul Artikel..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Status */}
        <div className="relative w-full md:w-48">
          <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-white appearance-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="Published">Tayang (Published)</option>
            <option value="Draft">Konsep (Draft)</option>
          </select>
        </div>
      </div>

      {/* --- TABLE ARTIKEL --- */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium w-20">Cover</th>
                <th className="px-6 py-4 font-medium">Judul & Kategori</th>
                <th className="px-6 py-4 font-medium">Penulis</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  
                  {/* Thumbnail Gambar */}
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      {/* Placeholder warna jika gambar error/tidak ada */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xs text-gray-400">
                         IMG
                      </div>
                      {/* Jika pakai Next Image, uncomment baris bawah ini dan pastikan src valid */}
                      {/* <Image src={item.image} alt="Thumbnail" fill className="object-cover" /> */}
                    </div>
                  </td>

                  {/* Judul & Kategori */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 dark:text-white line-clamp-1 mb-1">
                      {item.title}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </td>

                  {/* Penulis */}
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {item.author}
                  </td>

                  {/* Tanggal */}
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <HiCalendarDays size={14} />
                        {item.date}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`
                      px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit
                      ${item.status === "Published" 
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" 
                        : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Published" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Lihat Preview">
                        <HiEye size={18} />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Berita">
                        <HiPencilSquare size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <HiTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {filteredData.length === 0 && (
             <div className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                Belum ada artikel yang sesuai filter.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}