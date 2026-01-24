import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Siswa from "@/models/Siswa";
import Guru from "@/models/Guru";
import Berita from "@/models/Berita";

export async function GET() {
  try {
    await connectDB();
    
    // Hitung data secara paralel biar cepat
    const [totalSiswa, totalGuru, totalPrestasi] = await Promise.all([
      Siswa.countDocuments({ status: true }),
      Guru.countDocuments({ status: true }),
      Berita.countDocuments({ status: "Published", kategori: "Prestasi" }) // Hitung berita kategori prestasi
    ]);

    return NextResponse.json({
      success: true,
      data: {
        siswa: totalSiswa,
        guru: totalGuru,
        alumni: 1250, // Hardcode dulu karena belum ada modul Alumni
        prestasi: totalPrestasi
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}