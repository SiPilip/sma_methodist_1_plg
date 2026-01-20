"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  HiPlus, HiMagnifyingGlass, HiPencilSquare, HiTrash, HiChevronLeft, HiChevronRight,
  HiAcademicCap, HiUserGroup, 
  HiArrowDownTray
} from "react-icons/hi2";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; 
import { useDebounce } from "@/hooks/useDebounce";
import * as XLSX from "xlsx";

// Tipe Data
type Siswa = {
  _id: string;
  nama: string;
  nisn: string;
  jurusan: string;
  rombel: string;
  angkatan: number;
  status: boolean;
  foto?: string;
};

type ApiResponse = {
  success: boolean;
  data: Siswa[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

// Update Fetcher untuk menerima parameter 'status'
const fetchSiswa = async (page: number, search: string, status: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
    q: search,
    status: status, // Kirim filter ke API
  });
  
  const res = await fetch(`/api/siswa?${params.toString()}`);
  const json = await res.json();
  return json as ApiResponse;
};

export default function SiswaPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"aktif" | "alumni">("aktif"); // State Tab
  
  const debouncedSearch = useDebounce(search, 500);

  // Query Data (Otomatis refresh saat Tab berubah)
  const { data: response, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["siswa", page, debouncedSearch, statusFilter], 
    queryFn: () => fetchSiswa(page, debouncedSearch, statusFilter),
    placeholderData: (previousData) => previousData,
  });

  const dataSiswa = response?.data || [];
  const pagination = response?.pagination;

  // Logic Kelas Display
  const getKelasDisplay = (angkatan: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const schoolYearStart = currentMonth >= 7 ? currentYear : currentYear - 1;
    const gradeNumber = 10 + (schoolYearStart - angkatan);
    
    if (gradeNumber === 10) return "X";
    if (gradeNumber === 11) return "XI";
    if (gradeNumber === 12) return "XII";
    if (gradeNumber > 12) return "Lulus";
    return "Calon";
  };

  // Logic Bulk Delete (Sama)
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/siswa/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ ids }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["siswa"] });
    }
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && dataSiswa) setSelectedIds(dataSiswa.map(s => s._id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleDelete = (ids: string[]) => {
    Swal.fire({
      title: 'Hapus Data?',
      text: `Menghapus ${ids.length} siswa terpilih.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
    }).then((result) => {
      if (result.isConfirmed) bulkDeleteMutation.mutate(ids);
    });
  };

  const handleExport = () => {
    if (!dataSiswa || dataSiswa.length === 0) {
      toast.error("Tidak ada data untuk diexport");
      return;
    }

    // 1. Format Data agar rapi di Excel
    const dataToExport = dataSiswa.map(siswa => ({
      "Nama Lengkap": siswa.nama,
      "NISN": siswa.nisn,
      "Status": statusFilter === "aktif" ? "Aktif" : "Alumni",
      "Kelas Saat Ini": statusFilter === "aktif" ? getKelasDisplay(siswa.angkatan) : "Lulus",
      "Jurusan": siswa.jurusan,
      "Rombel": siswa.rombel,
      "Angkatan": siswa.angkatan,
      // Kita tidak export URL foto karena tidak bisa tampil di sel excel standar
    }));

    // 2. Buat Worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");

    // 3. Download File
    XLSX.writeFile(workbook, `Data_Siswa_${statusFilter}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Data berhasil didownload!");
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Siswa</h1>
          <p className="text-sm text-gray-500">
             Total: {pagination?.totalData || 0} {statusFilter === "aktif" ? "Siswa Aktif" : "Alumni"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
               <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Cari..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
               />
            </div>
            <button 
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm shadow-lg whitespace-nowrap transition-colors"
        title="Download Data ke Excel"
      >
        <HiArrowDownTray size={18} /> Export
      </button>
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                  <button onClick={() => handleDelete(selectedIds)} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-bold text-sm transition-colors animate-in zoom-in">
                      <HiTrash size={18} /> ({selectedIds.length})
                  </button>
              )}
              <Link href="/admin/siswa/tambah" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-lg whitespace-nowrap">
                  <HiPlus size={18} /> Tambah
              </Link>
              
            </div>
        </div>
      </div>

      {/* --- TAB NAVIGASI (BARU) --- */}
      <div className="border-b border-gray-200 dark:border-white/10">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => { setStatusFilter("aktif"); setPage(1); }}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
              ${statusFilter === "aktif" 
                ? "border-blue-500 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            <HiUserGroup size={18} />
            Siswa Aktif
          </button>
          
          <button
            onClick={() => { setStatusFilter("alumni"); setPage(1); }}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
              ${statusFilter === "alumni" 
                ? "border-purple-500 text-purple-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            <HiAcademicCap size={18} />
            Alumni / Lulus
          </button>
        </nav>
      </div>

      {/* TABEL */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        
        {isLoading && !isPlaceholderData && (
           <div className="p-10 text-center text-gray-500 animate-pulse">Memuat data...</div>
        )}

        <div className={`overflow-x-auto ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-6 py-4 w-4">
                    <input type="checkbox" className="rounded text-blue-600" onChange={handleSelectAll} checked={dataSiswa.length > 0 && dataSiswa.length === selectedIds.length} />
                  </th>
                  <th className="px-6 py-4 font-semibold">Nama Siswa</th>
                  <th className="px-6 py-4 font-semibold">NISN</th>
                  <th className="px-6 py-4 font-semibold">
                    {statusFilter === "aktif" ? "Kelas" : "Angkatan"}
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {dataSiswa.length > 0 ? dataSiswa.map((siswa) => (
                    <tr key={siswa._id} className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group ${selectedIds.includes(siswa._id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded text-blue-600" checked={selectedIds.includes(siswa._id)} onChange={() => handleSelectOne(siswa._id)} />
                      </td>
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        {siswa.foto ? (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                             <Image src={siswa.foto} alt={siswa.nama} fill className="object-cover" sizes="36px" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">{siswa.nama.substring(0, 2)}</div>
                        )}
                        <div>
                           <p className="text-gray-900 dark:text-white font-semibold">{siswa.nama}</p>
                           {/* Jika di tab Alumni, tampilkan info tambahan */}
                           {statusFilter === "alumni" && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded">Alumni</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500">{siswa.nisn}</td>
                      <td className="px-6 py-4">
                        {statusFilter === "aktif" ? (
                          <>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold mr-1 border border-blue-100">
                              {getKelasDisplay(siswa.angkatan)}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">{siswa.jurusan} {siswa.rombel}</span>
                          </>
                        ) : (
                           <span className="text-gray-600 font-mono">Angkatan {siswa.angkatan}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/siswa/${siswa._id}`} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-100 rounded-lg"><HiPencilSquare size={18}/></Link>
                            <button onClick={() => handleDelete([siswa._id])} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><HiTrash size={18}/></button>
                      </td>
                    </tr>
                )) : (
                   <tr><td colSpan={5} className="text-center py-12 text-gray-500">Tidak ada data {statusFilter === "aktif" ? "siswa aktif" : "alumni"}.</td></tr>
                )}
              </tbody>
            </table>
        </div>

        {/* PAGINATION (SAMA) */}
        {pagination && pagination.totalPages > 1 && (
           <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
              <p className="text-xs text-gray-500">
                 Halaman <span className="font-bold">{pagination.currentPage}</span> dari {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                 <button onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1} className="p-2 rounded-lg border bg-white disabled:opacity-50 hover:bg-gray-50">
                    <HiChevronLeft size={16} />
                 </button>
                 <span className="text-xs font-bold bg-white px-3 py-2 rounded-lg border">{page}</span>
                 <button onClick={() => setPage(old => (pagination.totalPages > old ? old + 1 : old))} disabled={page === pagination.totalPages} className="p-2 rounded-lg border bg-white disabled:opacity-50 hover:bg-gray-50">
                    <HiChevronRight size={16} />
                 </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}