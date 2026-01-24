"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  HiAcademicCap, HiUsers, HiNewspaper, HiDocumentText, 
  HiArrowTrendingUp, HiClock 
} from "react-icons/hi2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registrasi ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

// Helper: Format Waktu (misal: "2 jam yang lalu")
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return "Baru saja";
};

// Fetcher
const fetchDashboard = async () => {
  const res = await fetch("/api/dashboard");
  const json = await res.json();
  return json;
};

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboard,
    refetchInterval: 30000 // Refresh otomatis tiap 30 detik (biar kerasa live)
  });

  const stats = dashboard?.stats;
  const activities = dashboard?.activities || [];

  // Data Chart
  const chartData = {
    labels: ['IPA', 'IPS'],
    datasets: [
      {
        data: stats?.chart || [0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(249, 115, 22, 0.8)', // Orange
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-500">Menyiapkan Dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header & Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Ikhtisar</h1>
        <p className="text-sm text-gray-500">Selamat datang kembali, Admin! Berikut adalah laporan hari ini.</p>
      </div>

      {/* 2. Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Card Siswa */}
         <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
            <div>
               <p className="text-sm text-gray-500 font-medium mb-1">Total Siswa Aktif</p>
               <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.siswa || 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
               <HiAcademicCap size={24}/>
            </div>
         </div>

         {/* Card Guru */}
         <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:border-purple-200 transition-colors">
            <div>
               <p className="text-sm text-gray-500 font-medium mb-1">Pengajar & Staf</p>
               <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.guru || 0}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
               <HiUsers size={24}/>
            </div>
         </div>

         {/* Card Berita */}
         <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:border-green-200 transition-colors">
            <div>
               <p className="text-sm text-gray-500 font-medium mb-1">Berita Terbit</p>
               <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.berita || 0}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
               <HiNewspaper size={24}/>
            </div>
         </div>

         {/* Card Dokumen */}
         <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-colors">
            <div>
               <p className="text-sm text-gray-500 font-medium mb-1">Dokumen Arsip</p>
               <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.dokumen || 0}</h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
               <HiDocumentText size={24}/>
            </div>
         </div>
      </div>

      {/* 3. Grid Content: Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI (2/3): CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                 <HiArrowTrendingUp className="text-blue-500"/> Sebaran Siswa
              </h3>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-64">
              {/* Chart */}
              <div className="h-full w-64 relative">
                 <Doughnut data={chartData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">{stats?.siswa}</span>
                 </div>
              </div>

              {/* Legend Manual (biar lebih rapi) */}
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold">Jurusan IPA</p>
                       <p className="font-bold text-lg">{stats?.chart[0]} Siswa</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold">Jurusan IPS</p>
                       <p className="font-bold text-lg">{stats?.chart[1]} Siswa</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* KOLOM KANAN (1/3): RECENT ACTIVITY */}
        <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-6 flex flex-col h-full">
           <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <HiClock className="text-purple-500"/> Aktivitas Terbaru
           </h3>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {activities.length > 0 ? activities.map((item: any, idx: number) => (
                 <div key={idx} className="flex gap-4 relative">
                    {/* Garis Vertikal */}
                    {idx !== activities.length - 1 && (
                       <div className="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-gray-700"></div>
                    )}
                    
                    {/* Icon Dot */}
                    <div className={`
                       w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10
                       ${item.type === 'siswa' ? 'bg-blue-100 text-blue-600' : 
                         item.type === 'guru' ? 'bg-purple-100 text-purple-600' : 
                         item.type === 'berita' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}
                    `}>
                       {item.type === 'siswa' && <HiAcademicCap size={18}/>}
                       {item.type === 'guru' && <HiUsers size={18}/>}
                       {item.type === 'berita' && <HiNewspaper size={18}/>}
                       {item.type === 'dokumen' && <HiDocumentText size={18}/>}
                    </div>

                    {/* Content */}
                    <div>
                       <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-0.5">
                          {item.label}
                       </p>
                       <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2">
                          {item.desc}
                       </p>
                       <p className="text-xs text-gray-400 mt-1">
                          {timeAgo(item.time)}
                       </p>
                    </div>
                 </div>
              )) : (
                 <p className="text-center text-gray-400 text-sm py-10">Belum ada aktivitas.</p>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}