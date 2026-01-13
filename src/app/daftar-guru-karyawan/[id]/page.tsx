import { Metadata } from "next";
import GuruKaryawanDetail from "@/components/daftar-guru-karyawan/guru-karyawan-detail";
import defaultProfilePicture from "@/../public/img/blank-profile-picture.webp";

// --- 1. DATA DUMMY (Tanpa Website & Prestasi) ---
const guruData = {
  id: "oliver-granli",
  name: "Oliver Granli, S.Pd., M.M.",
  nip: "19850101 201001 1 001",

  // Data Baru/Updated
  category: "Guru" as const, // Bisa diganti "Karyawan"
  jobTitle: "Kepala Sekolah", // Jabatan
  subject: "Matematika Lanjut", // Mata Pelajaran (Kosongkan stringnya jika Karyawan)

  description:
    "Oliver Granli adalah seorang pendidik berdedikasi dengan pengalaman lebih dari 15 tahun.",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  image: defaultProfilePicture,
  email: "oliver.granli@sekolah.sch.id",
  phone: "+62 812 3456 7890",

  education: [
    {
      degree: "Magister Manajemen Pendidikan (S2)",
      institution: "Universitas Indonesia",
      year: "2015",
    },
    {
      degree: "Sarjana Pendidikan Matematika (S1)",
      institution: "Universitas Negeri Jakarta",
      year: "2008",
    },
  ],

  socials: {
    linkedin: "https://linkedin.com/in/olivergranli",
    twitter: "https://twitter.com/olivergranli",
  },
  url: "/guru/oliver-granli",
  updatedAt: "2024-03-20",
};

// --- 2. STATIC METADATA (Updated) ---
export const metadata: Metadata = {
  title: `${guruData.name} - ${guruData.jobTitle}`,
  description: guruData.description,
  keywords: [
    guruData.name,
    guruData.jobTitle,
    guruData.subject || "",
    "Profil Guru",
    "Sekolah",
  ].join(", "),

  openGraph: {
    type: "profile",
    firstName: "Oliver",
    lastName: "Granli",
    username: "olivergranli",
    title: guruData.name,
    description: guruData.description,
    url: `https://yourwebsite.com${guruData.url}`,
    siteName: "Website Sekolah Methodist 1 Palembang",
    images: [
      {
        url: `https://yourwebsite.com${guruData.image}`,
        width: 800,
        height: 800,
        alt: `Foto Profil ${guruData.name}`,
      },
    ],
  },
};

// --- 3. JSON-LD (Updated: Removed sameAs website) ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: guruData.name,
  jobTitle: guruData.jobTitle,
  image: `https://yourwebsite.com${guruData.image}`,
  description: guruData.description,
  url: `https://yourwebsite.com${guruData.url}`,
  email: guruData.email,
  telephone: guruData.phone,
  worksFor: {
    "@type": "EducationalOrganization",
    name: "SMA Methodist 1 Palembang",
    url: "https://yourwebsite.com",
  },
  alumniOf: guruData.education.map((edu) => ({
    "@type": "CollegeOrUniversity",
    name: edu.institution,
  })),
  sameAs: [guruData.socials.linkedin, guruData.socials.twitter],
};

export default function GuruDetail() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuruKaryawanDetail data={guruData} />
    </>
  );
}
