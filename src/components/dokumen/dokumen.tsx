"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiArrowDownOnSquare, HiMagnifyingGlass, HiDocumentText, HiEye } from "react-icons/hi2";
import { Container } from "../container";
import Pagination from "../pagination";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Fetcher Function (GET List)
const fetchDokumen = async (page: number, search: string) => {
  const res = await fetch(`/api/public/dokumen?page=${page}&q=${search}`);
  return res.json();
};

export default function DokumenClient({ initialData }: { initialData: any }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  // 1. GET DATA
  const { data, isLoading } = useQuery({
    queryKey: ["dokumen-public", page, debouncedSearch],
    queryFn: () => fetchDokumen(page, debouncedSearch),
    initialData: page === 1 && !debouncedSearch ? initialData : undefined,
    placeholderData: (prev) => prev,
  });

  // 2. MUTATION (INCREMENT DOWNLOAD)
  const mutation = useMutation({
    mutationFn: async (docId: string) => {
      await fetch(`/api/public/dokumen/${docId}/download`, { method: "POST" });
    },
    onSuccess: () => {
      // Refresh data agar angka download langsung bertambah di layar (opsional)
      queryClient.invalidateQueries({ queryKey: ["dokumen-public"] });
    }
  });

  const docs = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <section className="dark:bg-[#495A87] bg-gray-50 min-h-screen py-12 transition-colors">
      <Container>
        
        {/* Header Control */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Arsip Dokumen</h2>
             <p className="text-gray-500 dark:text-gray-300 text-sm">Unduh dokumen resmi sekolah di bawah ini.</p>
          </div>
          
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Cari nama dokumen..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-[#2E3853] rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="p-5 text-sm font-bold text-gray-500 dark:text-gray-300 uppercase w-16 text-center">No</th>
                  <th className="p-5 text-sm font-bold text-gray-500 dark:text-gray-300 uppercase">Nama Dokumen</th>
                  <th className="p-5 text-sm font-bold text-gray-500 dark:text-gray-300 uppercase w-40">Kategori</th>
                  <th className="p-5 text-sm font-bold text-gray-500 dark:text-gray-300 uppercase w-40">Tanggal</th>
                  <th className="p-5 text-sm font-bold text-gray-500 dark:text-gray-300 uppercase w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {isLoading && !data ? (
                   [...Array(5)].map((_, i) => (
                     <tr key={i} className="animate-pulse">
                       <td className="p-5"><div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div></td>
                       <td className="p-5"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                       <td className="p-5"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                       <td className="p-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                       <td className="p-5"><div className="h-8 bg-gray-200 rounded w-full"></div></td>
                     </tr>
                   ))
                ) : docs.length > 0 ? (
                  docs.map((item: any, idx: number) => (
                    <tr 
                      key={item._id} 
                      className="group hover:bg-blue-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="p-5 text-center text-gray-500 dark:text-gray-400 font-medium">
                        {(page - 1) * 10 + idx + 1}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-lg shrink-0">
                              <HiDocumentText size={20} />
                           </div>
                           <div>
                              <p className="font-bold text-gray-800 dark:text-white text-base group-hover:text-blue-600 transition-colors">
                                {item.judul}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex gap-2 items-center flex-wrap">
                                <span className="uppercase font-semibold bg-gray-100 dark:bg-white/10 px-1.5 rounded text-[10px]">
                                  {item.tipeFile || "FILE"}
                                </span>
                                <span>{item.ukuranFile || "-"}</span>
                                <span className="text-gray-300">•</span>
                                
                                {/* --- FITUR DOWNLOAD COUNT --- */}
                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium" title="Jumlah didownload">
                                   <HiArrowDownOnSquare size={12}/> {item.downloadCount || 0}x Unduh
                                </span>
                                {/* --------------------------- */}
                                
                                <span className="text-gray-300">•</span>
                                <span className="line-clamp-1 max-w-[200px]">{item.deskripsi}</span>
                              </div>
                           </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-200">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-gray-600 dark:text-gray-300">
                        {item.createdAt 
                          ? format(new Date(item.createdAt), "dd MMM yyyy", { locale: id }) 
                          : "-"}
                      </td>
                      <td className="p-5 text-center">
                        <Link
                          href={item.fileUrl || "#"} 
                          target="_blank"
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg shadow-sm transition-all ${
                            item.fileUrl 
                              ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow active:scale-95" 
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          onClick={(e) => {
                             if (!item.fileUrl) {
                               e.preventDefault();
                               return;
                             }
                             // HIT API INCREMENT DI SINI
                             mutation.mutate(item._id);
                          }}
                        >
                          <HiArrowDownOnSquare size={18} />
                          Unduh
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500 dark:text-gray-400">
                       <div className="flex flex-col items-center gap-2">
                          <HiDocumentText size={40} className="text-gray-300"/>
                          <p>Tidak ada dokumen yang ditemukan.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>

      </Container>
    </section>
  );
}