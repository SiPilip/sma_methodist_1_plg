"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiChartPie, 
  HiUsers, 
  HiAcademicCap, 
  HiNewspaper, 
  HiDocumentText, 
  HiArrowLeftOnRectangle,
  HiBuildingLibrary
} from "react-icons/hi2";

export default function AdminSidebar() {
  const pathname = usePathname();

  // Daftar Menu Navigasi
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: HiChartPie },
    { name: "Data Siswa", href: "/admin/siswa", icon: HiAcademicCap },
    { name: "Guru & Staff", href: "/admin/guru", icon: HiUsers },
    { name: "Berita / Blog", href: "/admin/berita", icon: HiNewspaper },
    { name: "Dokumen & SK", href: "/admin/dokumen", icon: HiDocumentText },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#1a202c] border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col h-screen sticky top-0 left-0 z-40">
      
      {/* 1. Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-950 dark:text-white">
          <HiBuildingLibrary className="text-blue-600" />
          <span>Admin Panel</span>
        </div>
      </div>

      {/* 2. Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          // Logic: Cek apakah URL saat ini sama dengan href menu
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200" // Style Aktif
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900" // Style Inaktif
                }
              `}
            >
              <item.icon size={20} className={isActive ? "text-blue-600 dark:text-blue-300" : "text-gray-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Logout Button (Bottom) */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <HiArrowLeftOnRectangle size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}