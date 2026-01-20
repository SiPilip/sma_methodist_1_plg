"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  HiPlus, HiMagnifyingGlass, HiPencilSquare, HiTrash, HiChevronLeft, HiChevronRight,
  HiNewspaper, HiDocumentText, HiEye
} from "react-icons/hi2";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; 
import { useDebounce } from "@/hooks/useDebounce";

// Tipe Data
type Berita = {
  _id: string;
  judul: string;
  slug: string;
  kategori: string;
  thumbnail?: string;
  status: "Published" | "Draft";
  views: number;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  data: Berita[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

const fetchBerita = async (page: number, search: string, status: string) => {
  // Kita bisa filter status lewat API (perlu sedikit modif di API jika ingin strict filter status, 
  // tapi untuk sekarang kita filter di client atau asumsikan API mendukung filter 'q' umum)
  // *Catatan: Agar sempurna, update API Berita GET untuk terima param 'status'.
  // Tapi codingan API di atas belum ada filter status spesifik, mari kita tambahkan nanti jika perlu.
  // Untuk saat ini kita pakai search query biasa.
  
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
    q: search,
  });
  
  const res = await fetch(`/api/berita?${params.toString()}`);
  const json = await res.json();
  return json as ApiResponse;
};

export default function BeritaPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  // Filter Tab di Frontend (sementara)
  const [tabStatus, setTabStatus] = useState<"Published" | "Draft">("Published");
  
  const debouncedSearch = useDebounce(search, 500);

  const { data: response, isLoading } = useQuery({
    queryKey: ["berita", page, debouncedSearch],
    queryFn: () => fetchBerita(page, debouncedSearch, ""),
  });

  // Filter Data Sesuai Tab (Client Side Filter sementara)
  const allBerita = response?.data || [];
  const filteredBerita = allBerita.filter(b => b.status === tabStatus);
  const pagination = response?.pagination;

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/berita/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Berita dihapus");
      queryClient.invalidateQueries({ queryKey: ["berita"] });
    }
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus Berita?',
      text: "Data tidak bisa dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Hapus',
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Artikel & Berita</h1>
          <p className="text-sm text-gray-500">Kelola konten blog sekolah.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
               <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Cari Judul..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <Link href="/admin/berita/tambah" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-lg whitespace-nowrap">
                <HiPlus size={18} /> Tulis Berita
            </Link>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b border-gray-200 dark:border-white/10">
        <nav className="-mb-px flex gap-6">
          <button onClick={() => setTabStatus("Published")} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all ${tabStatus === "Published" ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            <HiNewspaper size={18} /> Tayang (Published)
          </button>
          <button onClick={() => setTabStatus("Draft")} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all ${tabStatus === "Draft" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            <HiDocumentText size={18} /> Konsep (Draft)
          </button>
        </nav>
      </div>

      {/* LIST BERITA */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
         {isLoading ? (
            <div className="p-10 text-center animate-pulse text-gray-500">Memuat berita...</div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b">
                     <tr>
                        <th className="px-6 py-4">Artikel</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4">Statistik</th>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                     {filteredBerita.length > 0 ? filteredBerita.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                           <td className="px-6 py-4">
                              <div className="flex gap-3 items-center">
                                 <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 border">
                                    {item.thumbnail ? (
                                       <Image src={item.thumbnail} alt={item.judul} fill className="object-cover" />
                                    ) : (
                                       <div className="flex items-center justify-center h-full text-gray-300"><HiNewspaper size={20}/></div>
                                    )}
                                 </div>
                                 <div>
                                    <p className="font-bold text-gray-800 dark:text-white line-clamp-1 max-w-xs">{item.judul}</p>
                                    <p className="text-xs text-gray-500">Slug: {item.slug}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold">{item.kategori}</span>
                           </td>
                           <td className="px-6 py-4 text-gray-500">
                              <div className="flex items-center gap-1 text-xs font-bold">
                                 <HiEye className="text-gray-400"/> {item.views} Views
                              </div>
                           </td>
                           <td className="px-6 py-4 text-gray-500 text-xs">
                              {new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <Link href={`/admin/berita/${item._id}`} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-100 rounded-lg"><HiPencilSquare size={18}/></Link>
                                 <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><HiTrash size={18}/></button>
                              </div>
                           </td>
                        </tr>
                     )) : (
                        <tr><td colSpan={5} className="text-center py-12 text-gray-500">Tidak ada berita {tabStatus === "Published" ? "tayang" : "draft"}.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
}