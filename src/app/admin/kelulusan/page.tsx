"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  HiArrowPath, HiClock, HiDocumentCheck, HiPencilSquare, HiMagnifyingGlass 
} from "react-icons/hi2";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import EditKelulusanModal from "@/components/EditKelulusanModal";

// --- FETCHERS ---
const fetchConfig = async () => {
  const res = await fetch("/api/kelulusan/config");
  return (await res.json()).data;
};

const fetchData = async () => {
  const res = await fetch("/api/kelulusan/admin");
  return (await res.json()).data;
};

export default function AdminKelulusanPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Queries
  const { data: config, isLoading: loadConfig } = useQuery({ queryKey: ["kelulusan-config"], queryFn: fetchConfig });
  const { data: listSiswa, isLoading: loadData } = useQuery({ queryKey: ["kelulusan-data"], queryFn: fetchData });

  // Filter Search
  const filteredData = listSiswa?.filter((s:any) => 
    s.nama.toLowerCase().includes(search.toLowerCase()) || 
    s.nisn.includes(search)
  ) || [];

  // --- MUTATION SYNC ---
  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/kelulusan/admin", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["kelulusan-data"] });
    },
    onError: (err: any) => toast.error(err.message)
  });

  // --- MUTATION UPDATE CONFIG ---
  const configMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/kelulusan/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Pengaturan disimpan!");
      queryClient.invalidateQueries({ queryKey: ["kelulusan-config"] });
    }
  });

  const handleSync = () => {
    Swal.fire({
      title: 'Tarik Data Kelas 12?',
      text: "Sistem akan menyalin data siswa kelas 12 aktif ke tabel kelulusan.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Sinkronisasi',
    }).then((result) => {
      if (result.isConfirmed) syncMutation.mutate();
    });
  };

  const handleSaveConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    configMutation.mutate({
      tahunAjaran: formData.get("tahunAjaran"),
      waktuPengumuman: formData.get("waktuPengumuman"),
      isLive: formData.get("isLive") === "on",
      infoKontak: formData.get("infoKontak"),
    });
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* MODAL EDIT */}
      {selectedItem && (
        <EditKelulusanModal 
          data={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["kelulusan-data"] })}
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pengumuman Kelulusan</h1>
           <p className="text-sm text-gray-500">Kelola jadwal rilis dan data kelulusan siswa.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all active:scale-95"
        >
          {syncMutation.isPending ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : <HiArrowPath size={20}/>}
          Sync Data Siswa
        </button>
      </div>

      {/* CARD 1: KONFIGURASI TIMER */}
      <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm p-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10"><HiClock size={100}/></div>
         <h2 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10"><HiClock className="text-blue-500"/> Pengaturan Jadwal</h2>
         
         {loadConfig ? <div className="animate-pulse h-20 bg-gray-100 rounded-lg"></div> : (
           <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tahun Ajaran</label>
                 <input type="text" name="tahunAjaran" defaultValue={config?.tahunAjaran} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Waktu Pengumuman (Tgl & Jam)</label>
                 <input type="datetime-local" name="waktuPengumuman" defaultValue={config?.waktuPengumuman ? new Date(config.waktuPengumuman).toISOString().slice(0, 16) : ""} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
              </div>
              <div className="flex items-end">
                 <button type="submit" className="w-full py-2.5 bg-blue-950 text-white rounded-lg font-bold hover:bg-blue-900 shadow transition-colors">
                    Simpan Jadwal
                 </button>
              </div>
              <div className="md:col-span-4 flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" name="isLive" defaultChecked={config?.isLive} className="sr-only peer" />
                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                 </label>
                 <div className="text-sm">
                    <p className="font-bold text-gray-800 dark:text-white">Buka Akses Pengumuman?</p>
                    <p className="text-xs text-gray-500">Jika Aktif, siswa bisa melihat hasil sesuai jadwal. Jika Mati, akses ditutup total.</p>
                 </div>
              </div>
           </form>
         )}
      </div>

      {/* CARD 2: TABEL DATA SISWA */}
      <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
         {/* Toolbar */}
         <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="font-bold text-lg flex items-center gap-2"><HiDocumentCheck className="text-green-500"/> Data Kandidat ({filteredData.length})</h2>
            <div className="relative w-full sm:w-64">
               <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Cari Nama / NISN..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 focus:bg-white outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5 border-b">
                  <tr>
                     <th className="px-6 py-4">Siswa</th>
                     <th className="px-6 py-4">Kelas</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Dokumen SKL</th>
                     <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {loadData ? (
                     <tr><td colSpan={5} className="text-center py-10">Memuat data...</td></tr>
                  ) : filteredData.length > 0 ? (
                     filteredData.map((item: any) => (
                        <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                           <td className="px-6 py-4">
                              <p className="font-bold text-gray-800 dark:text-white">{item.nama}</p>
                              <p className="text-xs text-gray-500 font-mono">{item.nisn}</p>
                           </td>
                           <td className="px-6 py-4">{item.kelas}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                 item.status === 'Lulus' ? 'bg-green-100 text-green-700 border-green-200' :
                                 item.status === 'Tidak Lulus' ? 'bg-red-100 text-red-700 border-red-200' :
                                 item.status === 'Ditunda' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                 'bg-gray-100 text-gray-500 border-gray-200'
                              }`}>
                                 {item.status.toUpperCase()}
                              </span>
                              {/* Indikator Approve */}
                              {item.isPublished ? (
                                <span className="ml-2 text-[10px] text-blue-600 bg-blue-50 px-1 rounded border border-blue-100">Tayang</span>
                              ) : (
                                <span className="ml-2 text-[10px] text-gray-400 bg-gray-50 px-1 rounded border">Draft</span>
                              )}
                           </td>
                           <td className="px-6 py-4">
                              {item.fileSklUrl ? (
                                 <a href={item.fileSklUrl} target="_blank" className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                                    <HiDocumentCheck/> Lihat SKL
                                 </a>
                              ) : (
                                 <span className="text-xs text-gray-400 italic">Belum ada file</span>
                              )}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setSelectedItem(item)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors"
                              >
                                 <HiPencilSquare className="inline mr-1"/> Edit / Upload
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-500">
                           {search ? "Data tidak ditemukan." : "Belum ada data. Silakan klik tombol 'Sync Data Siswa' di atas."}
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}