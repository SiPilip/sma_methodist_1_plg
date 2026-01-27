import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import GuruKaryawanDetail from "@/components/guru-karyawan/guru-karyawan-detail";
import defaultProfilePicture from "@/../public/img/blank-profile-picture.webp";
import { IGuru } from "@/models/Guru";

// --- 1. REAL FETCH DATA (Server Side) ---
async function getGuru(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/public/guru/${id}`, {
    cache: "no-store", // Selalu ambil data terbaru
  });

  if (res.status === 404) {
    notFound(); // Trigger halaman 404 jika ID tidak ditemukan
  }

  if (!res.ok) {
    throw new Error("Gagal mengambil data guru");
  }

  const json = await res.json();
  const rawGuru: IGuru = json.data;

  // --- Transformasi Data dari API ke format yang diharapkan Frontend ---
  const guruImage = rawGuru.foto ? `${baseUrl}${rawGuru.foto}` : `${baseUrl}${defaultProfilePicture.src}`;

  return {
    id: rawGuru._id,
    name: rawGuru.nama,
    nip: rawGuru.nip,
    category: rawGuru.kategori,
    jobTitle: rawGuru.jabatan,
    subject: rawGuru.mataPelajaran,
    description:
      rawGuru.bio?.substring(0, 155) ||
      `Profil lengkap ${rawGuru.nama}, ${rawGuru.jabatan} di SMA Methodist 1 Palembang.`,
    bio: rawGuru.bio || "Ora et labora.",
    // `image` untuk komponen, `imageUrl` untuk metadata
    image: rawGuru.foto || defaultProfilePicture,
    imageUrl: guruImage,
    email: rawGuru.email,
    phone: rawGuru.noHp,
    education:
      rawGuru.pendidikan?.map((edu) => ({
        degree: edu.jenjang,
        institution: edu.instansi,
        year: edu.tahun,
      })) || [],
    socials: rawGuru.socials || {},
    updatedAt: new Date(rawGuru.updatedAt).toISOString(),
  };
}

type Props = {
  params: { id: string };
};

// --- 2. DYNAMIC METADATA (SEO Core) ---
// Mengenerate meta tag secara otomatis berdasarkan data asli
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const data = await getGuru(id);
  const baseUrl =
    process.env.NEXT_PUBLIC_URL || "https://smetsaplg.id";
  const pageUrl = `${baseUrl}/guru-karyawan/${data.id}`;

  return {
    title: `${data.name} - ${data.jobTitle} | SMA Methodist 1 Palembang`,
    description: data.description,
    keywords: [
      data.name,
      data.jobTitle,
      data.subject || "",
      "Guru SMA Methodist 1",
      "Profil Pengajar",
    ].join(", "),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "profile",
      username: data.id.toString(),
      firstName: data.name.split(" ")[0],
      lastName: data.name.split(" ").slice(1).join(" ") || "",
      title: `${data.name} | ${data.jobTitle}`,
      description: data.description,
      url: pageUrl,
      siteName: "SMA Methodist 1 Palembang",
      images: [
        {
          url: data.imageUrl, // Menggunakan URL absolut yang sudah ditransformasi
          width: 800,
          height: 800,
          alt: `Foto Profil ${data.name}`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// --- 3. PAGE COMPONENT ---
export default async function GuruPage({ params }: Props) {
  const { id } = await params;
  const guruData = await getGuru(id);
  const baseUrl =
    process.env.NEXT_PUBLIC_URL || "https://smetsaplg.id";
  const pageUrl = `${baseUrl}/guru-karyawan/${guruData.id}`;

  // --- JSON-LD (Structured Data) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: guruData.name,
    jobTitle: guruData.jobTitle,
    image: guruData.imageUrl, // Pastikan URL absolut untuk Schema
    description: guruData.description,
    url: pageUrl,
    email: guruData.email,
    telephone: guruData.phone,
    worksFor: {
      "@type": "EducationalOrganization",
      name: "SMA Methodist 1 Palembang",
      url: baseUrl,
    },
    alumniOf: guruData.education.map((edu) => ({
      "@type": "CollegeOrUniversity",
      name: edu.institution,
    })),
    sameAs: [
      guruData.socials.linkedin,
      guruData.socials.twitter,
    ].filter(Boolean), // Hapus jika link kosong
  };

  return (
    <>
      {/* Inject JSON-LD untuk Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Render Component UI */}
      <GuruKaryawanDetail data={guruData} />
    </>
  );
}