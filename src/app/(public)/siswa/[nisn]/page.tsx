import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import SiswaDetail from "@/components/siswa/siswa-detail";
import { ISiswa } from "@/models/Siswa"; // Impor interface dari model
import Guru from "@/models/Guru"; // Impor model Guru
import connectDB from "@/lib/db"; // Impor koneksi DB

// --- 1. REAL BACKEND CALL ---
// Fungsi ini sekarang akan memanggil API endpoint yang sebenarnya.
async function getSiswa(nisn: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/public/siswa/${nisn}`, {
    cache: "no-store", // Selalu ambil data terbaru untuk profil individu
  });

  if (res.status === 404) {
    notFound(); // Menampilkan halaman 404 standar dari Next.js
  }

  if (!res.ok) {
    throw new Error("Gagal mengambil data siswa"); // Error untuk kasus lain
  }

  const { data } = await res.json();

  // --- Ambil data Wali Kelas ---
  await connectDB();
  const waliKelasData = await Guru.findOne({
    "waliUntukKelas.angkatan": data.angkatan,
    "waliUntukKelas.jurusan": data.jurusan,
    "waliUntukKelas.rombel": data.rombel,
  }).lean();

  if (waliKelasData) {
    data.waliKelas = {
      nama: waliKelasData.nama,
      nip: waliKelasData.nip,
      telepon: waliKelasData.noHp || "-", // Fallback jika nomor HP tidak ada
      linkProfile: `/guru-karyawan/${waliKelasData._id.toString()}`,
    };
  }

  return data;
}

type Props = {
  params: Promise<{ nisn: string }>;
};

// --- 2. DYNAMIC METADATA (SEO) ---
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { nisn } = await params;
  const siswa = await getSiswa(nisn);
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const imageUrl = siswa.foto ? `${baseUrl}${siswa.foto}` : `${baseUrl}/img/logo.png`;

  return {
    title: `${siswa.nama} - Siswa ${siswa.jurusan} | SMA Methodist 1`,
    description: `Profil akademik ${siswa.nama}, siswa kelas ${siswa.kelas} jurusan ${siswa.jurusan} angkatan ${siswa.angkatan} di SMA Methodist 1 Palembang.`,
    openGraph: {
      type: "profile",
      username: siswa.nisn,
      title: `${siswa.nama} | Profil Siswa`,
      description: `Siswa Kelas ${siswa.kelas} - ${siswa.jurusan}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `Profil ${siswa.nama}`,
        },
      ],
    },
    robots: { index: true, follow: true }
  };
}

// --- 3. MAIN PAGE COMPONENT ---
export default async function Page({ params }: Props) {
  const { nisn } = await params;
  const siswaData = await getSiswa(nisn);

  // JSON-LD Schema (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siswaData.nama,
    identifier: siswaData.nisn,
    jobTitle: "Student",
    affiliation: {
      "@type": "EducationalOrganization",
      name: "SMA Methodist 1 Palembang",
      sameAs: "https://smetsaplg.id" // Ganti dengan URL web sekolah yang benar
    },
    image: siswaData.foto,
    description: `Siswa kelas ${siswaData.kelas} jurusan ${siswaData.jurusan}, Angkatan ${siswaData.angkatan}.`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Render Component UI yang sudah dipisah */}
      <SiswaDetail data={siswaData} />
    </>
  );
}