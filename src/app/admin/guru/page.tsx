"use client";

import { useState } from "react";
import { 
  HiMagnifyingGlass, 
  HiFunnel, 
  HiPlus, 
  HiPencilSquare, 
  HiTrash,
  HiUser
} from "react-icons/hi2";
import Image from "next/image";
// Kita pakai gambar default dummy jika belum ada foto
import defaultProfile from "@/../public/img/blank-profile-picture.webp"; 
import Link from "next/link";

// 1. Tipe Data Dummy
type Staff = {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: "Guru" | "Staff"; // Pembeda utama
  position: string; // Jabatan (misal: Guru Matematika, Kepala TU)
  status: "Aktif" | "Cuti" | "Pensiun";
  image: string; // Untuk simulasi
};

// 2. Data Dummy (Campuran Guru & Staff)
const initialStaff: Staff[] = [
  {
    id: "G-001",
    nip: "19850101 201001 1 001",
    name: "Oliver Granli, S.Pd., M.M.",
    email: "oliver.granli@sekolah.sch.id",
    role: "Guru",
    position: "Kepala Sekolah",
    status: "Aktif",
    image: defaultProfile.src
  },
  {
    id: "G-002",
    nip: "19900202 201502 2 002",
    name: "Sarah Connor, S.Si.",
    email: "sarah.c@sekolah.sch.id",
    role: "Guru",
    position: "Guru Biologi",
    status: "Aktif",
    image: defaultProfile.src
  },
  {
    id: "S-001",
    nip: "20000303 202203 1 003",
    name: "John Doe, A.Md.",
    email: "john.tu@sekolah.sch.id",
    role: "Staff",
    position: "Staf Tata Usaha",
    status: "Aktif",
    image: defaultProfile.src
  },
  {
    id: "G-003",
    nip: "19880404 201204 1 004",
    name: "Budi Santoso, S.Kom.",
    email: "budi.it@sekolah.sch.id",
    role: "Guru",
    position: "Guru TIK",
    status: "Cuti",
    image: defaultProfile.src
  },
];

export default function AdminGuruPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Semua"); // Filter Guru vs Staff

  // Logic Filter Sederhana
  const filteredData = initialStaff.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.nip.includes(searchTerm);
    const matchRole = filterRole === "Semua" ? true : item.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Guru & Staff</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manajemen tenaga pendidik dan kependidikan sekolah.
          </p>
        </div>
        <Link 
          href="/admin/guru/tambah" // Nanti kita buat halaman editornya
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <HiPlus size={20} />
          Tambah Guru
        </Link>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama atau NIP..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Role (Guru vs Staff) */}
        <div className="relative w-full md:w-48">
          <HiFunnel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 dark:text-white appearance-none cursor-pointer"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="Semua">Semua Tipe</option>
            <option value="Guru">Guru / Pengajar</option>
            <option value="Staff">Staff / Karyawan</option>
          </select>
        </div>
      </div>

      {/* --- TABLE GURU & STAFF --- */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Nama & Email</th>
                <th className="px-6 py-4 font-medium">NIP / ID</th>
                <th className="px-6 py-4 font-medium">Jabatan</th>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  
                  {/* Kolom Profil (Foto + Nama) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-700">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* NIP */}
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-300">
                    {item.nip}
                  </td>

                  {/* Jabatan */}
                  <td className="px-6 py-4 text-gray-800 dark:text-white">
                    {item.position}
                  </td>

                  {/* Role Badge (Guru vs Staff) */}
                  <td className="px-6 py-4">
                    <span className={`
                      px-2.5 py-1 rounded-md text-xs font-bold border
                      ${item.role === "Guru" 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800" 
                        : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"}
                    `}>
                      {item.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`
                      px-2.5 py-1 rounded-full text-xs font-semibold
                      ${item.status === "Aktif" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}
                    `}>
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
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

          {/* Empty State jika search tidak ketemu */}
          {filteredData.length === 0 && (
             <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Data tidak ditemukan untuk pencarian ini.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}