"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  HiClock, HiUserCircle, HiTrash, HiPencil, HiPlus, HiArrowRightOnRectangle 
} from "react-icons/hi2";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Helper Warna & Ikon berdasarkan Action
const getActionBadge = (action: string) => {
  switch (action) {
    case "CREATE":
      return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100"><HiPlus/> TAMBAH</span>;
    case "UPDATE":
      return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold border border-blue-100"><HiPencil/> EDIT</span>;
    case "DELETE":
      return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100"><HiTrash/> HAPUS</span>;
    case "LOGIN":
      return <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-bold border border-purple-100"><HiArrowRightOnRectangle/> LOGIN</span>;
    default:
      return <span className="text-gray-500 text-xs font-bold">{action}</span>;
  }
};

export default function LogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const res = await fetch("/api/logs");
      const json = await res.json();
      return json.data || [];
    },
    refetchInterval: 10000 // Auto refresh tiap 10 detik (Realtime feel)
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat Rekaman CCTV...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-3 bg-gray-800 text-white rounded-xl">
            <HiClock size={24}/>
         </div>
         <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Audit Log Aktivitas</h1>
            <p className="text-sm text-gray-500">Rekaman 100 aktivitas terakhir di sistem.</p>
         </div>
      </div>

      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 uppercase text-xs border-b">
                  <tr>
                     <th className="px-6 py-4">Waktu</th>
                     <th className="px-6 py-4">User (Pelaku)</th>
                     <th className="px-6 py-4">Aksi</th>
                     <th className="px-6 py-4">Target</th>
                     <th className="px-6 py-4">Detail Aktivitas</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {logs?.map((log: any) => (
                     <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                           {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", { locale: id })} WIB
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <HiUserCircle className="text-gray-400" size={16}/>
                              <span className="font-bold text-gray-700 dark:text-gray-300">{log.namaUser}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           {getActionBadge(log.action)}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">
                           {log.target}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                           {log.details}
                        </td>
                     </tr>
                  ))}
                  {logs?.length === 0 && (
                     <tr><td colSpan={5} className="text-center py-8 text-gray-400">Belum ada aktivitas terekam.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}