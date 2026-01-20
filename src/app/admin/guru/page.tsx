"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as XLSX from "xlsx"; // Import SheetJS
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  HiPlus, HiMagnifyingGlass, HiPencilSquare, HiTrash, HiChevronLeft, HiChevronRight,
  HiBriefcase, HiAcademicCap, HiArrowDownTray // Import Icon Export
} from "react-icons/hi2";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; 
import { useDebounce } from "@/hooks/useDebounce";

// Tipe Data Guru (Sesuai Model)
type Pendidikan = {
  jenjang: string;
  instansi: string;
  tahun: string;
};

type Guru = {
  _id: string;
  nama: string;
  nip: string;
  jabatan: string;
  kategori: "Guru" | "Karyawan";
  mataPelajaran?: string;
  foto?: string;
  pendidikan: Pendidikan[];
  email?: string;
  noHp?: string;
  status: boolean;
};

type ApiResponse = {
  success: boolean;
  data: Guru[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

// Fetcher
const fetchGuru = async (page: number, search: string, kategori: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
    q: search,
    kategori: kategori,
  });
  
  const res = await fetch(`/api/guru?${params.toString()}`);
  const json = await res.json();
  return json as ApiResponse;
};

export default function GuruPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState<"Guru" | "Karyawan">("Guru");
  
  const debouncedSearch = useDebounce(search, 500);

  // Query
  const { data: response, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["guru", page, debouncedSearch, kategoriFilter],
    queryFn: () => fetchGuru(page, debouncedSearch, kategoriFilter),
    placeholderData: (previousData) => previousData,
  });

  const dataGuru = response?.data || [];
  const pagination = response?.pagination;

  // Bulk Delete
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/guru/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ ids }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["guru"] });
    }
  });

  const handleDelete = (ids: string[]) => {
    Swal.fire({
      title: 'Hapus Data?',
      text: `Menghapus ${ids.length} data terpilih.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
    }).then((result) => {
      if (result.isConfirmed) bulkDeleteMutation.mutate(ids);
    });
  };

  // Checkbox Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && dataGuru) setSelectedIds(dataGuru.map(s => s._id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // --- LOGIC EXPORT EXCEL (BARU) ---
  const handleExport = () => {
    if (!dataGuru || dataGuru.length === 0) {
      toast.error("Tidak ada data untuk diexport");
      return;
    }

    // 1. Formatting Data untuk Excel
    const dataToExport = dataGuru.map(guru => ({
      "Nama Lengkap": guru.nama,
      "NIP / NUPTK": guru.nip,
      "Kategori": guru.kategori,
      "Jabatan": guru.jabatan,
      "Mata Pelajaran": guru.mataPelajaran || "-",
      "Email": guru.email || "-",
      "No HP": guru.noHp || "-",
      "Pendidikan Terakhir": guru.pendidikan.length > 0 ? `${guru.pendidikan[0].jenjang} ${guru.pendidikan[0].instansi}` : "-",
      "Status": guru.status ? "Aktif" : "Non-Aktif"
    }));

    // 2. Buat File Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Data ${kategoriFilter}`);
    
    // Auto width kolom (Opsional, biar rapi)
    const maxWidth = dataToExport.reduce((w, r) => Math.max(w, r["Nama Lengkap"].length), 10);
    worksheet["!cols"] = [ { wch: maxWidth + 5 }, { wch: 20 }, { wch: 10 }, { wch: 20 } ];

    // 3. Download
    XLSX.writeFile(workbook, `Data_${kategoriFilter}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Data berhasil didownload!");
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Pengajar & Staf</h1>
          <p className="text-sm text-gray-500">
             Total: {pagination?.totalData || 0} Data
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
               <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Cari Nama / NIP..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
               />
            </div>

            <div className="flex items-center gap-2">
              {/* Tombol Hapus Massal */}
              {selectedIds.length > 0 && (
                  <button onClick={() => handleDelete(selectedIds)} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-bold text-sm transition-colors animate-in zoom-in">
                      <HiTrash size={18} /> ({selectedIds.length})
                  </button>
              )}
              
              {/* Tombol Export (BARU) */}
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm shadow-lg whitespace-nowrap transition-colors"
                title="Download Excel"
              >
                  <HiArrowDownTray size={18} /> Export
              </button>

              {/* Tombol Tambah */}
              <Link href="/admin/guru/tambah" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-lg whitespace-nowrap">
                  <HiPlus size={18} /> Tambah
              </Link>
            </div>
        </div>
      </div>

      {/* TAB NAVIGASI */}
      <div className="border-b border-gray-200 dark:border-white/10">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => { setKategoriFilter("Guru"); setPage(1); }}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all ${kategoriFilter === "Guru" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <HiAcademicCap size={18} /> Tenaga Pengajar
          </button>
          
          <button
            onClick={() => { setKategoriFilter("Karyawan"); setPage(1); }}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all ${kategoriFilter === "Karyawan" ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <HiBriefcase size={18} /> Staf & Karyawan
          </button>
        </nav>
      </div>

      {/* TABEL */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        {isLoading && !isPlaceholderData && <div className="p-10 text-center text-gray-500 animate-pulse">Memuat data...</div>}

        <div className={`overflow-x-auto ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-6 py-4 w-4"><input type="checkbox" className="rounded text-blue-600" onChange={handleSelectAll} checked={dataGuru.length > 0 && dataGuru.length === selectedIds.length} /></th>
                  <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                  <th className="px-6 py-4 font-semibold">NIP / ID</th>
                  <th className="px-6 py-4 font-semibold">Jabatan</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {dataGuru.length > 0 ? dataGuru.map((guru) => (
                    <tr key={guru._id} className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group ${selectedIds.includes(guru._id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <td className="px-6 py-4"><input type="checkbox" className="rounded text-blue-600" checked={selectedIds.includes(guru._id)} onChange={() => handleSelectOne(guru._id)} /></td>
                      
                      {/* NAMA + FOTO */}
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        {guru.foto ? (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                             <Image src={guru.foto} alt={guru.nama} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">{guru.nama.substring(0, 2)}</div>
                        )}
                        <div>
                           <p className="text-gray-900 dark:text-white font-semibold">{guru.nama}</p>
                           {/* Jika Guru, tampilkan mapel */}
                           {guru.mataPelajaran && <p className="text-[10px] text-gray-500">{guru.mataPelajaran}</p>}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-gray-500">{guru.nip}</td>
                      
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                          {guru.jabatan}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/guru/${guru._id}`} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-100 rounded-lg"><HiPencilSquare size={18}/></Link>
                            <button onClick={() => handleDelete([guru._id])} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><HiTrash size={18}/></button>
                      </td>
                    </tr>
                )) : (
                   <tr><td colSpan={5} className="text-center py-12 text-gray-500">Tidak ada data.</td></tr>
                )}
              </tbody>
            </table>
        </div>

        {/* PAGINATION */}
        {pagination && pagination.totalPages > 1 && (
           <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
              <p className="text-xs text-gray-500">Hal {pagination.currentPage} dari {pagination.totalPages}</p>
              <div className="flex gap-2">
                 <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-2 border rounded hover:bg-white disabled:opacity-50"><HiChevronLeft/></button>
                 <button onClick={() => setPage(p => Math.min(pagination.totalPages, p+1))} disabled={page===pagination.totalPages} className="p-2 border rounded hover:bg-white disabled:opacity-50"><HiChevronRight/></button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}