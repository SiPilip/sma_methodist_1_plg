import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Siswa from "@/models/Siswa";
import Kelulusan from "@/models/Kelulusan";
import { getCurrentUser } from "@/lib/auth";


// Helper: Hitung Angkatan Kelas 12
const getAngkatanKelas12 = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  // Jika bulan > 6 (Juli ke atas), Kelas 12 adalah angkatan (Year - 2)
  // Jika bulan < 6 (Juni ke bawah), Kelas 12 adalah angkatan (Year - 3)
  // Contoh: Jan 2026. Kelas 12 masuk tahun 2023.
  return month > 6 ? year - 2 : year - 3;
};

// GET: Ambil Daftar Kandidat Kelulusan
export async function GET(req: Request) {
  try {
    await connectDB();
    const data = await Kelulusan.find().sort({ nama: 1 });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// POST: SYNC DATA (Tarik Siswa Kelas 12 ke Tabel Kelulusan)
export async function POST(req: Request) {
  const user = await getCurrentUser();
    // Jika User bukan SuperAdmin DAN bukan Editor (Berarti dia Osis), tolak.
  if (!user || (user.role !== "SuperAdmin" && user.role !== "Editor")) {
    return NextResponse.json({ message: "Akses ditolak. Peran Anda tidak diizinkan." }, { status: 403 });
  }
  
  try {
    await connectDB();
    const angkatanTarget = getAngkatanKelas12();

    // 1. Cari Siswa Kelas 12 (Sesuai Angkatan) yang AKTIF
    const siswaKelas12 = await Siswa.find({ 
      angkatan: angkatanTarget,
      status: true 
    });

    if (siswaKelas12.length === 0) {
      return NextResponse.json({ message: `Tidak ditemukan siswa angkatan ${angkatanTarget}` }, { status: 404 });
    }

    let countAdded = 0;

    // 2. Loop dan masukkan ke Kelulusan jika belum ada
    for (const s of siswaKelas12) {
      const exists = await Kelulusan.findOne({ nisn: s.nisn });
      if (!exists) {
        await Kelulusan.create({
          siswaId: s._id,
          nama: s.nama,
          nisn: s.nisn,
          tglLahir: s.tanggalLahir, // Pastikan format di Siswa sudah string YYYY-MM-DD, jika belum nanti kita format di frontend
          kelas: `${s.jurusan} ${s.rombel}`, // XII IPA 1
          status: "Pending",
          isPublished: false // Butuh approve admin
        });
        countAdded++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sinkronisasi selesai. ${countAdded} siswa baru ditambahkan ke daftar kelulusan.` 
    }, { status: 200 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}