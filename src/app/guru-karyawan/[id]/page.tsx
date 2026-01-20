import { Metadata, ResolvingMetadata } from "next";
import GuruKaryawanDetail from "@/components/guru-karyawan/guru-karyawan-detail";
import defaultProfilePicture from "@/../public/img/blank-profile-picture.webp";

// --- 1. SIMULASI FETCH DATA (Server Side) ---
// Nanti diganti dengan: const res = await fetch(`api/guru/${id}`)
async function getGuru(id: string) {
  // Simulasi delay network
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Data Dummy (Simulasi database)
  return {
    id: id,
    name: "Oliver Granli, S.Pd., M.M.",
    nip: "19850101 201001 1 001",
    category: "Guru" as const,
    jobTitle: "Kepala Sekolah",
    subject: "Matematika Lanjut",
    
    description: "Oliver Granli adalah seorang pendidik berdedikasi dengan pengalaman lebih dari 15 tahun.",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    
    // Penting: Tetap gunakan object import untuk komponen Image Next.js
    image: defaultProfilePicture, 
    
    email: "oliver.granli@sekolah.sch.id",
    phone: "+62 812 3456 7890", // Data kontak publik guru (biasanya kantor)

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
    updatedAt: "2024-03-20",
  };
}

type Props = {
  params: { id: string };
};

// --- 2. DYNAMIC METADATA (SEO Core) ---
// Mengenerate meta tag secara otomatis berdasarkan ID guru
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch data
  const data = await getGuru(params.id);
  
  // Base URL (Bisa dari environment variable)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sekolah-methodist-1.sch.id";
  const pageUrl = `${baseUrl}/guru/${data.id}`;

  return {
    title: `${data.name} - ${data.jobTitle} | SMA Methodist 1`,
    description: data.description,
    keywords: [data.name, data.jobTitle, data.subject || "", "Guru SMA Methodist 1", "Profil Pengajar"].join(", "),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "profile",
      username: data.id,
      firstName: data.name.split(" ")[0],
      lastName: data.name.split(" ")[1] || "",
      title: data.name,
      description: data.description,
      url: pageUrl,
      siteName: "SMA Methodist 1 Palembang",
      images: [
        {
          // Akses .src karena data.image adalah object StaticImageData
          url: `${baseUrl}${data.image.src}`, 
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
  const guruData = await getGuru(params.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sekolah-methodist-1.sch.id";

  // --- JSON-LD (Structured Data) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: guruData.name,
    jobTitle: guruData.jobTitle,
    image: `${baseUrl}${guruData.image.src}`, // Pastikan URL absolut untuk Schema
    description: guruData.description,
    url: `${baseUrl}/guru/${guruData.id}`,
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
      guruData.socials.twitter
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
      {/* Pastikan GuruKaryawanDetail menerima prop 'data' yang sesuai */}
      <GuruKaryawanDetail data={guruData} />
    </>
  );
}