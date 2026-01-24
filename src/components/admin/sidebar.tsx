"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  HiChartPie, HiUsers, HiAcademicCap, HiNewspaper, HiDocumentText, 
  HiArrowLeftOnRectangle, HiBuildingLibrary, HiShieldCheck,
  HiLockClosed, // <--- Tambah Icon Gembok
  HiClock,
  HiCog6Tooth
} from "react-icons/hi2";
import { HiSpeakerphone } from "react-icons/hi";

// Fetch Role User
const fetchMe = async () => {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    const json = await res.json();
    return json.user;
  } catch (error) { return null; }
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const role = user?.role || "";

  // Definisi Semua Menu & Hak Akses
  const allMenus = [
    { name: "Dashboard", href: "/admin", icon: HiChartPie, roles: ["SuperAdmin", "Editor", "Osis"] },
    { name: "Manajemen User", href: "/admin/users", icon: HiShieldCheck, roles: ["SuperAdmin"] },
    { name: "Data Siswa", href: "/admin/siswa", icon: HiAcademicCap, roles: ["SuperAdmin", "Editor"] },
    { name: "Guru & Staff", href: "/admin/guru", icon: HiUsers, roles: ["SuperAdmin", "Editor"] },
    { name: "Kelulusan", href: "/admin/kelulusan", icon: HiSpeakerphone, roles: ["SuperAdmin", "Editor"] },
    { name: "Berita / Blog", href: "/admin/berita", icon: HiNewspaper, roles: ["SuperAdmin", "Editor", "Osis"] },
    { name: "Dokumen & SK", href: "/admin/dokumen", icon: HiDocumentText, roles: ["SuperAdmin", "Editor", "Osis"] },
    { name: "Pengaturan Akun", href: "/admin/profile", icon: HiCog6Tooth, roles: ["SuperAdmin", "Editor", "Osis"] },
    { name: "Audit Log", href: "/admin/logs", icon: HiClock, roles: ["SuperAdmin"] },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Berhasil keluar");
      router.refresh();
      router.push("/login");
    } catch (error) { toast.error("Gagal logout"); }
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#1a202c] border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col h-screen sticky top-0 left-0 z-40">
      
      {/* 1. Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-950 dark:text-white">
          <HiBuildingLibrary className="text-blue-600" />
          <span>Admin Panel</span>
        </div>
      </div>

      {/* 2. Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {allMenus.map((item) => {
          // Cek Izin
          const isAllowed = item.roles.includes(role);
          // Cek Aktif (Hanya jika allowed)
          const isActive = isAllowed && (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)));
          
          if (isAllowed) {
            // --- KONDISI 1: User Punya Akses (Render Link) ---
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                   <item.icon size={20} className={isActive ? "text-blue-600 dark:text-blue-300" : "text-gray-400 group-hover:text-gray-500"} />
                   {item.name}
                </div>
              </Link>
            );
          } else {
            // --- KONDISI 2: User TIDAK Punya Akses (Render Div Disabled) ---
            return (
              <div
                key={item.href}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-300 dark:text-gray-600 cursor-not-allowed select-none opacity-60"
                title="Anda tidak memiliki akses ke menu ini"
              >
                <div className="flex items-center gap-3">
                   <item.icon size={20} /> {/* Icon abu-abu mati */}
                   {item.name}
                </div>
                {/* Icon Gembok Kecil di Kanan */}
                <HiLockClosed size={14} className="text-gray-300 dark:text-gray-600"/>
              </div>
            );
          }
        })}
      </nav>

      {/* 3. Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <HiArrowLeftOnRectangle size={20} /> Keluar
        </button>
      </div>
    </aside>
  );
}