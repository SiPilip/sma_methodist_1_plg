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

export async function GET(
  req: Request,
  { params }: { params: { nisn: string } }
) {
  try {
    await connectDB();
    const { nisn } = params;

    // Cari siswa berdasarkan NISN dan status aktif
    const siswa = await SiswaModel.findOne({ nisn: nisn, status: true }).lean();

    // Jika tidak ditemukan, kirim 404
    if (!siswa) {
      return NextResponse.json(
        { success: false, message: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }
    
    // --- DEFENSIVE CHECK ---
    // Pastikan data yang diperlukan untuk kalkulasi ada
    if (siswa.angkatan == null || !siswa.jurusan || !siswa.rombel) {
      console.error(`Error API Siswa (NISN: ${params.nisn}): Data tidak lengkap. Angkatan/Jurusan/Rombel mungkin kosong.`);
      return NextResponse.json(
        { success: false, message: "Data siswa tidak lengkap di server." },
        { status: 500 }
      );
    }

    // Menambahkan field 'kelas' secara dinamis
    const currentAcademicYear = getCurrentAcademicYear();
    const kelasLevel = 10 + (currentAcademicYear - siswa.angkatan);
    const siswaWithKelas = {
        ...siswa,
        kelas: `${kelasLevel > 12 ? 'Alumni' : kelasLevel} ${siswa.jurusan} ${siswa.rombel}`
    }


    return NextResponse.json({
      success: true,
      data: siswaWithKelas,
    });
  } catch (error) {
    console.error(`Error API Siswa (NISN: ${params.nisn}):`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
