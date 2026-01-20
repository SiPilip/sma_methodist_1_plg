"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  HiMagnifyingGlass, 
  HiFunnel, 
  HiPlus, 
  HiPencilSquare, 
  HiTrash,
  HiEllipsisVertical
} from "react-icons/hi2";

// 1. Tipe Data Dummy
type Student = {
  id: string;
  nisn: string;
  name: string;
  class: string;
  gender: "L" | "P";
  status: "Aktif" | "Cuti" | "Lulus";
};

// 2. Data Dummy (Nanti diganti API)
const initialStudents: Student[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `S-${i}`,
  nisn: `007564${200 + i}`,
  name: i % 2 === 0 ? `Alexander Hamilton ${i+1}` : `Elizabeth Schuyler ${i+1}`,
  class: ["X IPA 1", "XI IPS 2", "XII IPA 3"][i % 3],
  gender: i % 2 === 0 ? "L" : "P",
  status: i === 4 ? "Cuti" : "Aktif",
}));

export default function AdminSiswaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="space-y-6">
      
      {/* --- HEADER: JUDUL & TOMBOL TAMBAH --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Siswa</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola data siswa, pantau status akademik, dan administrasi.
          </p>
        </div>
        <Link 
          href="/admin/siswa/tambah" // Nanti kita buat halaman editornya
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <HiPlus size={20} />
          Tambah Siswa
        </Link>
      </div>

      {/* --- TOOLBAR: PENCARIAN & FILTER --- */}
      <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama atau NISN..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-48">
          <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-white appearance-none cursor-pointer">
            <option value="">Semua Kelas</option>
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>
        </div>
      </div>

      {/* --- TABLE SISWA --- */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Siswa</th>
                <th className="px-6 py-4 font-medium">NISN</th>
                <th className="px-6 py-4 font-medium">Kelas</th>
                <th className="px-6 py-4 font-medium">L/P</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {initialStudents.map((siswa) => (
                <tr key={siswa.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  
                  {/* Nama */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {siswa.name}
                    </div>
                  </td>

                  {/* NISN */}
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300">
                    {siswa.nisn}
                  </td>

                  {/* Kelas */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium text-xs border border-blue-100 dark:border-blue-800/50">
                      {siswa.class}
                    </span>
                  </td>

                  {/* Gender */}
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {siswa.gender}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`
                      px-2.5 py-1 rounded-full text-xs font-semibold border
                      ${siswa.status === "Aktif" 
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" 
                        : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"}
                    `}>
                      {siswa.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Data"
                      >
                        <HiPencilSquare size={18} />
                      </button>
                      <button 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Siswa"
                      >
                        <HiTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Sederhana (Footer Table) */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan 1-10 dari 1240 siswa
            </span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-white/5">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}