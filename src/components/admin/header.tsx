"use client";

import { useQuery } from "@tanstack/react-query";
import { HiBars3, HiBell, HiUserCircle } from "react-icons/hi2";

// Fungsi untuk cek "Siapa saya?"
const fetchMe = async () => {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    const json = await res.json();
    return json.user;
  } catch (error) {
    return null;
  }
};

interface HeaderProps {
  onSidebarOpen: () => void;
}

export default function AdminHeader({ onSidebarOpen }: HeaderProps) {
  // Fetch data user
  const { data: user } = useQuery({ 
    queryKey: ["me"], 
    queryFn: fetchMe,
    retry: false // Jangan retry kalau gagal (misal belum login)
  });

  return (
    <header className="h-16 bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm transition-colors">
       
       {/* Kiri: Toggle Sidebar (Mobile) & Breadcrumb */}
       <div className="flex items-center gap-4">
          <button onClick={onSidebarOpen} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
             <HiBars3 size={24}/>
          </button>
          <div className="hidden md:block">
             <span className="text-gray-400 text-sm">Panel Admin &gt; </span>
             <span className="font-bold text-gray-800 dark:text-white text-sm ml-1">Dashboard</span>
          </div>
       </div>

       {/* Kanan: Profil & Notif */}
       <div className="flex items-center gap-4">
          {/* Lonceng Notif (Hiasan) */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors group">
             <HiBell size={22} className="group-hover:text-blue-600 transition-colors"/>
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800 animate-pulse"></span>
          </button>

          {/* Profil Dropdown */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10">
             <div className="text-right hidden sm:block">
                {/* Tampilkan Nama & Role Dinamis */}
                <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1 max-w-[150px]">
                  {user?.nama || "Memuat..."}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
                  {user?.role || "GUEST"}
                </p>
             </div>
             <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm">
                <HiUserCircle size={24}/>
             </div>
          </div>
       </div>
    </header>
  );
}