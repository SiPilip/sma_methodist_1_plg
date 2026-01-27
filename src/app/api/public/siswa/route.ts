import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SiswaModel from "@/models/Siswa";

// Fungsi untuk menghitung tahun ajaran saat ini
const getCurrentAcademicYear = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  // Tahun ajaran baru dimulai pada bulan Juli (indeks 6)
  return currentMonth >= 6 ? currentYear : currentYear - 1;
};

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const jurusan = searchParams.get("jurusan") || "";
    const angkatan = searchParams.get("angkatan") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = 12; // 12 Siswa per halaman
    const skip = (page - 1) * limit;

    // --- Build Query ---
    const query: any = {
      status: true, // Hanya tampilkan siswa yang aktif
    };

    // 1. Filter Jurusan
    if (jurusan) {
      query.jurusan = jurusan;
    }
    
    // 2. Filter Angkatan
    if (angkatan) {
      query.angkatan = Number(angkatan);
    }

    // 3. Filter Pencarian (Nama atau NISN)
    if (q) {
      query.$or = [
        { nama: { $regex: q, $options: "i" } },
        { nisn: { $regex: q, $options: "i" } },
      ];
    }

    // --- Eksekusi Query ---
    const [siswas, totalDocs] = await Promise.all([
      SiswaModel.find(query)
        .sort({ nama: 1 }) // Urutkan berdasarkan nama A-Z
        .skip(skip)
        .limit(limit)
        .lean(),
      SiswaModel.countDocuments(query),
    ]);

    // Menambahkan field 'kelas' secara dinamis
    const currentAcademicYear = getCurrentAcademicYear();
    const siswasWithKelas = siswas.map(siswa => {
      const kelasLevel = 10 + (currentAcademicYear - siswa.angkatan);
      return {
        ...siswa,
        kelas: `${kelasLevel > 12 ? 'Alumni' : kelasLevel} ${siswa.jurusan} ${siswa.rombel}`
      };
    });

    const totalPages = Math.ceil(totalDocs / limit);

    return NextResponse.json({
      success: true,
      data: siswasWithKelas,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalDocs,
      },
    });
  } catch (error) {
    console.error("Error API Siswa:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
