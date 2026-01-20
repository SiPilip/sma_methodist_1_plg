import StatCard from "@/components/admin/stat-card";
import { 
  HiAcademicCap, 
  HiUsers, 
  HiNewspaper, 
  HiDocumentText,
  HiClock
} from "react-icons/hi2";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* 1. HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pantau aktivitas sekolah dan kelola data dalam satu tempat.
        </p>
      </div>

      {/* 2. STATISTIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Siswa" 
          value="1,240" 
          icon={HiAcademicCap} 
          color="blue"
          trend="+12 Baru"
        />
        <StatCard 
          title="Guru & Staff" 
          value="86" 
          icon={HiUsers} 
          color="green"
        />
        <StatCard 
          title="Artikel Berita" 
          value="34" 
          icon={HiNewspaper} 
          color="orange"
          trend="+3 Minggu ini"
        />
        <StatCard 
          title="Dokumen SK" 
          value="128" 
          icon={HiDocumentText} 
          color="purple"
        />
      </div>

      {/* 3. RECENT ACTIVITY SECTION (Contoh Tabel Sederhana) */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <HiClock className="text-gray-400" />
            Aktivitas Terbaru
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Lihat Semua</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-3">User / Subjek</th>
                <th className="px-6 py-3">Aktivitas</th>
                <th className="px-6 py-3">Waktu</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {/* Dummy Row 1 */}
              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">Admin Utama</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Menambahkan Siswa Baru (X-IPA 1)</td>
                <td className="px-6 py-4 text-gray-500">2 menit yang lalu</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Berhasil</span>
                </td>
              </tr>
              {/* Dummy Row 2 */}
              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">Oliver Granli</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Mengupdate Biodata Guru</td>
                <td className="px-6 py-4 text-gray-500">1 jam yang lalu</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">Updated</span>
                </td>
              </tr>
               {/* Dummy Row 3 */}
               <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">System</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">Backup Database Otomatis</td>
                <td className="px-6 py-4 text-gray-500">Hari ini, 00:00</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">Selesai</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}