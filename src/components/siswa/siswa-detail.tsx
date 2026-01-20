// file: components/siswa/siswa-detail.tsx
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Container } from "@/components/container"; // Sesuaikan path import Container
import { 
  HiUser, 
  HiAcademicCap, 
  HiIdentification, 
  HiCalendar, 
  HiPhone 
} from "react-icons/hi2";

// Definisi Tipe Data (Supaya Type Safe)
export interface SiswaData {
  nisn: string;
  nama: string;
  angkatan: string;
  jurusan: string;
  kelas: string;
  tanggalLahir: string;
  motto: string;
  foto: StaticImageData | string; // Support import gambar lokal atau URL string
  waliKelas: {
    nama: string;
    nip: string;
    telepon: string;
    linkProfile: string;
  };
}

export default function SiswaDetail({ data }: { data: SiswaData }) {
  // Styles (Variabel style kita pindahkan ke sini)
  const labelStyle = "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide";
  const valueStyle = "text-lg font-medium text-blue-950 dark:text-white mt-0.5";
  const headerTableStyle = "bg-blue-950 text-white font-semibold py-3 px-4 text-sm uppercase tracking-wider";
  const bodyTableStyle = "bg-[#DFEBF7] dark:bg-[#7184BF] text-black dark:text-white py-3 px-4 text-sm font-medium";

  return (
    <section className="dark:bg-[#495A87] bg-[#F1F2F4] min-h-screen py-10">
      <Container>
        
        {/* BREADCRUMB */}
        <div className="mb-6 text-sm text-gray-500 dark:text-gray-300">
          <Link href="/siswa" className="hover:underline hover:text-blue-600">Daftar Siswa</Link> 
          <span className="mx-2">/</span>
          <span className="font-semibold text-blue-950 dark:text-white">{data.nama}</span>
        </div>

        {/* --- BAGIAN 1: PROFILE CARD --- */}
        <div className="bg-white dark:bg-white/10 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Kolom Kiri: FOTO & JURUSAN */}
            <div className="lg:col-span-4 bg-blue-50 dark:bg-black/20 p-8 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/10">
              <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-blue-100 dark:ring-white/10">
                <Image 
                  src={data.foto} 
                  alt={data.nama}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold text-blue-950 dark:text-white mb-2">{data.nama}</h1>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm font-bold">
                <HiAcademicCap className="w-4 h-4" />
                {data.jurusan}
              </div>
            </div>

            {/* Kolom Kanan: BIODATA DETAIL */}
            <div className="lg:col-span-8 p-8 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                
                {/* NISN */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-300">
                    <HiIdentification size={24} />
                  </div>
                  <div>
                    <p className={labelStyle}>NISN</p>
                    <p className={`${valueStyle} font-mono tracking-wider`}>{data.nisn}</p>
                  </div>
                </div>

                {/* Angkatan */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-300">
                    <HiUser size={24} />
                  </div>
                  <div>
                    <p className={labelStyle}>Angkatan</p>
                    <p className={valueStyle}>{data.angkatan}</p>
                  </div>
                </div>

                {/* Tanggal Lahir */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-300">
                    <HiCalendar size={24} />
                  </div>
                  <div>
                    <p className={labelStyle}>Tanggal Lahir</p>
                    <p className={valueStyle}>{data.tanggalLahir}</p>
                  </div>
                </div>

                {/* Kelas */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-300">
                    <HiAcademicCap size={24} />
                  </div>
                  <div>
                    <p className={labelStyle}>Kelas Saat Ini</p>
                    <p className={valueStyle}>{data.kelas}</p>
                  </div>
                </div>
              </div>

              {/* Motto */}
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                <p className={labelStyle}>Motto</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2 italic text-lg leading-relaxed">
                  &ldquo;{data.motto}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BAGIAN 2: INFORMASI WALI KELAS (CARD STYLE UNIFIED) --- */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-blue-950 dark:text-white mb-4 flex items-center gap-2">
            <HiUser className="text-blue-600" />
            Informasi Wali Kelas
          </h2>
          
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 border-l-4 border-l-blue-600 rounded-r-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* SISI KIRI: IDENTITAS (Nama & NIP) */}
              <div className="flex items-start gap-4">
                {/* Icon Avatar Besar */}
                <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-200">
                  <HiUser size={32} />
                </div>
                
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Wali Kelas
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-950 dark:text-white leading-tight">
                    {data.waliKelas.nama}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-md text-sm font-mono text-blue-800 dark:text-blue-200">
                     <HiIdentification className="opacity-70" />
                     {data.waliKelas.nip}
                  </div>
                </div>
              </div>

              {/* Garis Pemisah (Hanya di Mobile) */}
              <div className="md:hidden w-full h-px bg-gray-100 dark:bg-white/10"></div>

              {/* SISI KANAN: KONTAK & AKSI */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                
                {/* Info Telepon */}
                <div className="flex flex-col md:items-end">
                   <span className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase mb-1">
                     Kontak Darurat
                   </span>
                   <a 
                    href={`tel:${data.waliKelas.telepon}`} 
                    className="flex items-center gap-2 text-base font-bold text-gray-700 dark:text-gray-200 hover:text-green-600 transition-colors"
                   >
                     <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                        <HiPhone size={14} />
                     </div>
                     {data.waliKelas.telepon}
                   </a>
                </div>

                {/* Tombol Aksi */}
                <Link 
                   href={data.waliKelas.linkProfile}
                   className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 text-sm"
                 >
                   Lihat Profil
                </Link>
              </div>

            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3 italic">
            * Hubungi wali kelas hanya pada jam kerja untuk keperluan akademik mendesak.
          </p>
        </div>
      </Container>
    </section>
  );
}