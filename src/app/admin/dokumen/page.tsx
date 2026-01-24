"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  HiPlus, HiMagnifyingGlass, HiTrash, HiChevronLeft, HiChevronRight, 
  HiDocumentText, HiArrowDownTray, HiFolder
} from "react-icons/hi2";
import { BsFileEarmarkPdfFill, BsFileEarmarkWordFill, BsFileEarmarkExcelFill, BsFileEarmarkImageFill, BsFileEarmarkFill } from "react-icons/bs"; // Install react-icons jika belum ada ikon Bs*
import toast from "react-hot-toast";
import Swal from "sweetalert2"; 
import { useDebounce } from "@/hooks/useDebounce";

// Tipe Data
type Dokumen = {
  _id: string;
  judul: string;
  deskripsi?: string;
  fileUrl: string;
  kategori: string;
  tipeFile: string;
  ukuranFile: string;
  downloadCount: number;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  data: Dokumen[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

const fetchDokumen = async (page: number, search: string, kategori: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
    q: search,
    kategori: kategori,
  });
  
  const res = await fetch(`/api/dokumen?${params.toString()}`);
  return await res.json() as ApiResponse;
};

// Helper: Pilih Ikon Berdasarkan Tipe File
const getFileIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("pdf")) return <BsFileEarmarkPdfFill className="text-red-500 text-3xl" />;
  if (t.includes("doc") || t.includes("word")) return <BsFileEarmarkWordFill className="text-blue-500 text-3xl" />;
  if (t.includes("xls") || t.includes("sheet")) return <BsFileEarmarkExcelFill className="text-green-500 text-3xl" />;
  if (t.includes("jpg") || t.includes("png")) return <BsFileEarmarkImageFill className="text-purple-500 text-3xl" />;
  return <BsFileEarmarkFill className="text-gray-400 text-3xl" />;
};

export default function DokumenPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  
  const debouncedSearch = useDebounce(search, 500);

  const { data: response, isLoading } = useQuery({
    queryKey: ["dokumen", page, debouncedSearch, kategoriFilter],
    queryFn: () => fetchDokumen(page, debouncedSearch, kategoriFilter),
  });

  const dataDokumen = response?.data || [];
  const pagination = response?.pagination;

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/dokumen/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      return res.json();
    },
    onSuccess: () => {
      toast.success("File dihapus permanen");
      queryClient.invalidateQueries({ queryKey: ["dokumen"] });
    }
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus File?',
      text: "File fisik di server juga akan dihapus.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus',
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Arsip Dokumen</h1>
          <p className="text-sm text-gray-500">Kelola file download (SK, Jadwal, Formulir).</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
               <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Cari Dokumen..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <Link href="/admin/dokumen/tambah" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-lg whitespace-nowrap">
                <HiPlus size={18} /> Upload File
            </Link>
        </div>
      </div>

      {/* Tabs Kategori */}
      <div className="border-b border-gray-200 dark:border-white/10 overflow-x-auto">
        <nav className="-mb-px flex gap-6 min-w-max">
          {["Semua", "Akademik", "Surat Keputusan", "Formulir", "Lainnya"].map((kat) => (
            <button
              key={kat}
              onClick={() => { setKategoriFilter(kat); setPage(1); }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${kategoriFilter === kat ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {kat}
            </button>
          ))}
        </nav>
      </div>

      {/* Tabel File */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        {isLoading ? (
           <div className="p-10 text-center animate-pulse text-gray-500">Memuat file...</div>
        ) : (
           <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                 <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b">
                    <tr>
                       <th className="px-6 py-4">Nama File</th>
                       <th className="px-6 py-4">Kategori</th>
                       <th className="px-6 py-4">Info File</th>
                       <th className="px-6 py-4">Download</th>
                       <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {dataDokumen.length > 0 ? dataDokumen.map((doc) => (
                       <tr key={doc._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="px-6 py-4">
                             <div className="flex gap-4 items-start">
                                <div className="shrink-0 pt-1">{getFileIcon(doc.tipeFile)}</div>
                                <div>
                                   <p className="font-bold text-gray-800 dark:text-white text-base">{doc.judul}</p>
                                   <p className="text-xs text-gray-500 mt-1 line-clamp-1">{doc.deskripsi || "Tidak ada deskripsi"}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold border">{doc.kategori}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                             <div className="flex flex-col text-xs">
                                <span className="font-mono font-bold">{doc.tipeFile}</span>
                                <span>{doc.ukuranFile}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-1 text-gray-500 text-xs">
                                <HiArrowDownTray className="text-green-500"/> {doc.downloadCount}x Unduh
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200"
                                  title="Download / Preview"
                                >
                                  <HiArrowDownTray size={18}/>
                                </a>
                                <button onClick={() => handleDelete(doc._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200">
                                  <HiTrash size={18}/>
                                </button>
                             </div>
                          </td>
                       </tr>
                    )) : (
                       <tr><td colSpan={5} className="text-center py-12 text-gray-500 flex flex-col items-center gap-2"><HiFolder size={40} className="text-gray-300"/> Belum ada dokumen.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        )}
        
        {/* Pagination Sederhana */}
        {pagination && pagination.totalPages > 1 && (
           <div className="px-6 py-4 border-t flex justify-between items-center text-xs text-gray-500">
              <span>Hal {pagination.currentPage} dari {pagination.totalPages}</span>
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