export default function AdminHeader() {
  return (
    <header className="h-16 bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Kiri: Judul Halaman (Bisa dinamis nanti, sementara static) */}
      <div className="md:hidden font-bold text-gray-800 dark:text-white">
        SMA Methodist 1
      </div>
      <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
        Selamat datang kembali, Administrator.
      </div>

      {/* Kanan: Profil Admin */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-800 dark:text-white">Admin Utama</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
        </div>
        {/* Avatar Bulat Sederhana */}
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold border-2 border-white dark:border-gray-700 shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}