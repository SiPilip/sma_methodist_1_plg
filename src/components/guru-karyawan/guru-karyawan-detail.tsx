import Image, { ImageProps } from "next/image";
import { Container } from "@/components/container";
import {
  HiAcademicCap,
  HiBriefcase,
  HiIdentification,
  HiUser,
} from "react-icons/hi2";

// Update Interface: Hapus achievements, tambah kategori
interface GuruDetailProps {
  data: {
    name: string;
    nip: string;
    jobTitle: string; // Jabatan
    category: "Guru" | "Karyawan"; // Tambahan Kategori
    subject?: string; // Mata Pelajaran (Opsional, karena karyawan mungkin tidak punya)
    bio: string;
    image: string | ImageProps["src"];
    education: { degree: string; institution: string; year: string }[];
    email?: string;
  };
}

export default function GuruKaryawanDetail({ data }: GuruDetailProps) {
  return (
    <section className="bg-white dark:bg-[#495A87] py-16 transition-colors ">
      <Container>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* --- SIDEBAR KIRI (FOTO & INFO UTAMA) --- */}
          <div className="lg:w-4/12 flex flex-col items-center text-center">
            {/* Foto Profil */}
            <div className="relative w-64 h-64 mb-6 rounded-full p-2 border-4 border-dashed border-blue-950/30 dark:border-white/30">
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl bg-gray-200">
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Nama */}
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white mb-2">
              {data.name}
            </h1>

            {/* Label Kategori & Jabatan */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {/* Badge Kategori */}
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-sm font-semibold border border-blue-200 dark:border-blue-800">
                {data.category}
              </span>
              {/* Badge Jabatan */}
              <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold shadow-sm">
                {data.jobTitle}
              </span>
            </div>

            {/* Kotak Info Detail */}
            <div className="w-full bg-gray-50 dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 text-left space-y-4">
              {/* NIP */}
              <div className="flex items-center gap-3">
                <HiIdentification className="text-xl text-blue-950 dark:text-orange-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                    NIP / NUPTK
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white text-sm">
                    {data.nip}
                  </p>
                </div>
              </div>

              {/* Mata Pelajaran (Hanya muncul jika ada datanya) */}
              {data.subject && (
                <div className="flex items-center gap-3">
                  <HiBriefcase className="text-xl text-blue-950 dark:text-orange-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                      Mata Pelajaran
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">
                      {data.subject}
                    </p>
                  </div>
                </div>
              )}

              {/* Jabatan (Info tambahan di kotak) */}
              <div className="flex items-center gap-3">
                <HiUser className="text-xl text-blue-950 dark:text-orange-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                    Jabatan Struktural
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white text-sm">
                    {data.jobTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- KONTEN KANAN (BIO & RIWAYAT) --- */}
          <div className="lg:w-8/12 space-y-8">
            {/* Tentang Saya */}
            <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-transparent">
              <h3 className="text-xl font-bold text-blue-950 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">
                Tentang Saya
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                {data.bio}
              </p>
            </div>

            {/* Riwayat Pendidikan */}
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-950 dark:text-white mb-4">
                <HiAcademicCap className="text-2xl text-orange-500" />
                Riwayat Pendidikan
              </h3>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow border-l-4 border-blue-950 dark:border-orange-500"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white text-lg">
                        {edu.institution}
                      </h4>
                      <p className="text-blue-950 dark:text-blue-300 font-medium">
                        {edu.degree}
                      </p>
                    </div>
                    <span className="mt-2 md:mt-0 px-3 py-1 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm rounded border border-gray-200 dark:border-slate-600 font-mono">
                      Lulus: {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
