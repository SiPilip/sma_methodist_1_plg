// file: app/siswa/[nisn]/page.tsx
import { Metadata, ResolvingMetadata } from "next";
import defaultProfilePicture from "@/../public/img/blank-profile-picture.webp"; 
import SiswaDetail from "@/components/siswa/siswa-detail";

// --- 1. MOCK DATA / BACKEND CALL ---
// (Logic data tetap disini, agar bisa dipakai generateMetadata)
async function getSiswa(nisn: string) {
  // Simulasi fetch database
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    nisn: nisn,
    nama: "Alexander Hamilton",
    angkatan: "2024",
    jurusan: "MIPA",
    kelas: "XI MIPA 2",
    tanggalLahir: "12 Januari 2008",
    motto: "Non scholae sed vitae discimus - Kita belajar bukan untuk sekolah, tapi untuk hidup.",
    foto: defaultProfilePicture, 
    
    waliKelas: {
      nama: "Oliver Granli, S.Pd., M.M.",
      nip: "19850101 201001 1 001",
      telepon: "+62 812 3456 7890",
      linkProfile: "/guru/oliver-granli" 
    }
  };
}

type Props = {
  params: { nisn: string };
};

// --- 2. DYNAMIC METADATA (SEO) ---
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const siswa = await getSiswa(params.nisn);

  return {
    title: `${siswa.nama} - Siswa ${siswa.jurusan} | SMA Methodist 1`,
    description: `Profil akademik ${siswa.nama}, siswa jurusan ${siswa.jurusan} angkatan ${siswa.angkatan} di SMA Methodist 1 Palembang.`,
    openGraph: {
      type: "profile",
      username: siswa.nisn,
      title: siswa.nama,
      description: `Siswa Kelas ${siswa.kelas} - ${siswa.jurusan}`,
      images: [
        {
          // Ganti dengan URL absolute logo sekolah/foto siswa
          url: "https://sekolah-methodist-1.sch.id/img/logo.png", 
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
  const siswaData = await getSiswa(params.nisn);

  // JSON-LD Schema (SEO)
  // Tetap di page.tsx karena ini urusan mesin pencari, bukan UI visual
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siswaData.nama,
    identifier: siswaData.nisn,
    jobTitle: "Student",
    affiliation: {
      "@type": "EducationalOrganization",
      name: "SMA Methodist 1 Palembang",
      sameAs: "https://sekolah-methodist-1.sch.id"
    },
    description: `Siswa jurusan ${siswaData.jurusan}, Angkatan ${siswaData.angkatan}.`
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