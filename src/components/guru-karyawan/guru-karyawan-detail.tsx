import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import {
  HiAcademicCap,
  HiBriefcase,
  HiIdentification,
  HiUser,
  HiEnvelope,
  HiPhone,
  HiBuildingLibrary
} from "react-icons/hi2";

// Interface sesuai dengan data page.tsx
interface GuruDetailProps {
  data: {
    name: string;
    nip: string;
    jobTitle: string;
    category: "Guru" | "Karyawan";
    subject?: string;
    bio: string;
    image: string | ImageProps["src"];
    education: { degree: string; institution: string; year: string }[];
    email?: string;
    phone?: string;
  };
}

export default function GuruKaryawanDetail({ data }: GuruDetailProps) {
  // Styles (Konsisten dengan SiswaDetail)
  const labelStyle = "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide";
  const valueStyle = "text-lg font-medium text-blue-950 dark:text-white mt-0.5";

  return (
    <section className="dark:bg-[#495A87] bg-[#F1F2F4] min-h-screen py-10">
      <Container>
        
        {/* BREADCRUMB */}
        <div className="mb-6 text-sm text-gray-500 dark:text-gray-300">
          <Link href="/guru" className="hover:underline hover:text-blue-600">Daftar Guru & Staff</Link> 
          <span className="mx-2">/</span>
          <span className="font-semibold text-blue-950 dark:text-white">{data.name}</span>
        </div>

        {/* --- BAGIAN 1: PROFILE CARD (ATAS) --- */}
        <div className="bg-white dark:bg-white/10 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* KIRI: FOTO & IDENTITAS UTAMA */}
            <div className="lg:col-span-4 bg-blue-50 dark:bg-black/20 p-8 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/10">
              {/* Foto Profil */}
              <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-blue-100 dark:ring-white/10">
                <Image 
                  src={data.image} 
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Nama & Kategori */}
              <h1 className="text-2xl font-bold text-blue-950 dark:text-white mb-2">{data.name}</h1>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm font-bold border border-blue-200 dark:border-blue-800">
                  {data.category}
                </span>
                {data.subject && (
                  <span className="px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-sm font-bold border border-orange-200 dark:border-orange-800/30">
                    {data.subject}
                  </span>
                )}
              </div>
            </div>

            {/* KANAN: BIODATA & KONTAK */}
            <div className="lg:col-span-8 p-8 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                
                {/* NIP */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-300">
                    <HiIdentification size={24} />
                  </div>
                  <div>
                    <p className={labelStyle}>NIP / NUPTK</p>
                    <p className={`${valueStyle} font-mono tracking-wider`}>{data.nip}</p>
                  </div>
                </div>

                {/* Jabatan Struktural */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-300">
                    <HiBriefcase size={24} />
                  </div>
                  <div>
                    <p className={labelStyle}>Jabatan</p>
                    <p className={valueStyle}>{data.jobTitle}</p>
                  </div>
                </div>

                {/* Email (Jika Ada) */}
                {data.email && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-300">
                      <HiEnvelope size={24} />
                    </div>
                    <div>
                      <p className={labelStyle}>Email Sekolah</p>
                      <a href={`mailto:${data.email}`} className={`${valueStyle} hover:text-blue-600 underline decoration-blue-200 underline-offset-4`}>
                        {data.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Telepon (Jika Ada) */}
                {data.phone && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-blue-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-300">
                      <HiPhone size={24} />
                    </div>
                    <div>
                      <p className={labelStyle}>Kontak Kantor</p>
                      <p className={valueStyle}>{data.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio / Tentang Saya */}
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                <p className={labelStyle}>Tentang Saya</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg leading-relaxed">
                  {data.bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BAGIAN 2: RIWAYAT PENDIDIKAN (BAWAH) --- */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-blue-950 dark:text-white mb-4 flex items-center gap-2">
            <HiAcademicCap className="text-blue-600" />
            Riwayat Pendidikan
          </h2>

          <div className="grid gap-4">
            {data.education.map((edu, index) => (
              // Menggunakan Style CARD UNIFIED (Sama seperti Wali Kelas di Siswa)
              <div 
                key={index}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 border-l-4 border-l-blue-600 rounded-r-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Kiri: Institusi */}
                <div className="flex items-start gap-4">
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-200 shrink-0">
                    <HiBuildingLibrary size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-950 dark:text-white leading-tight">
                      {edu.institution}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                      {edu.degree}
                    </p>
                  </div>
                </div>

                {/* Kanan: Tahun Lulus (Badge) */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/10">
                  <span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Tahun Lulus</span>
                  <span className="px-4 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-mono font-bold border border-gray-200 dark:border-white/10">
                    {edu.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </Container>
    </section>
  );
}