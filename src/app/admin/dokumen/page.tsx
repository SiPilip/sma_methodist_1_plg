"use client";

import { useState } from "react";
import { 
  HiMagnifyingGlass, 
  HiFunnel, 
  HiPlus, 
  HiTrash,
  HiDocumentText, 
  HiArrowDownTray,
  HiDocument,
} from "react-icons/hi2";
import { BsFileEarmarkPdfFill, BsFileEarmarkWordFill, BsFileEarmarkExcelFill } from "react-icons/bs";
import Link from "next/link";

// 1. Tipe Data Dummy
type DocumentItem = {
  id: string;
  name: string;
  category: "SK" | "Akademik" | "Lainnya";
  type: "pdf" | "docx" | "xlsx";
  size: string;
  date: string;
  downloads: number;
};

// 2. Data Dummy
const initialDocs: DocumentItem[] = [
  {
    id: "1",
    name: "Kalender Akademik 2025-2026.pdf",
    category: "Akademik",
    type: "pdf",
    size: "2.4 MB",
    date: "2025-07-15",
    downloads: 450
  },
  {
    id: "2",
    name: "SK Pengangkatan Guru Honorer 2025.pdf",
    category: "SK",
    type: "pdf",
    size: "1.1 MB",
    date: "2025-01-10",
    downloads: 12
  },
  {
    id: "3",
    name: "Format RPP Kurikulum Merdeka.docx",
    category: "Akademik",
    type: "docx",
    size: "540 KB",
    date: "2025-02-20",
    downloads: 89
  },
  {
    id: "4",
    name: "Laporan Keuangan Ekstrakurikuler.xlsx",
    category: "Lainnya",
    type: "xlsx",
    size: "890 KB",
    date: "2025-11-05",
    downloads: 5
  },
];

export default function AdminDokumenPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");

  // Logic Filter
  const filteredData = initialDocs.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === "Semua" ? true : item.category === filterCategory;
    return matchSearch && matchCat;
  });

  // Helper untuk Icon File
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <BsFileEarmarkPdfFill className="text-red-500" size={24} />;
      case "docx": return <BsFileEarmarkWordFill className="text-blue-500" size={24} />;
      case "xlsx": return <BsFileEarmarkExcelFill className="text-green-500" size={24} />;
      default: return <HiDocument className="text-gray-400" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Arsip Dokumen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload dan kelola dokumen digital (SK, Jadwal, SOP) untuk didownload.
          </p>
        </div>
        <Link 
          href="/admin/dokumen/tambah" // Nanti kita buat halaman editornya
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <HiPlus size={20} />
          Tambah Dokumen
        </Link>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama File..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Kategori */}
        <div className="relative w-full md:w-48">
          <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-white appearance-none cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="SK">SK & Surat</option>
            <option value="Akademik">Akademik</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      {/* --- TABLE DOKUMEN --- */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Nama File</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Ukuran</th>
                <th className="px-6 py-4 font-medium">Tanggal Upload</th>
                <th className="px-6 py-4 font-medium">Diunduh</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  
                  {/* Nama File & Icon */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        {getFileIcon(item.type)}
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white line-clamp-1">
                        {item.name}
                      </div>
                    </div>
                  </td>

                  {/* Kategori Badge */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold border border-gray-200 dark:border-gray-600">
                      {item.category}
                    </span>
                  </td>

                  {/* Ukuran */}
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                    {item.size}
                  </td>

                  {/* Tanggal */}
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {item.date}
                  </td>

                  {/* Statistik Download */}
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {item.downloads}x
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download">
                        <HiArrowDownTray size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus File">
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
                Tidak ada dokumen yang ditemukan.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}