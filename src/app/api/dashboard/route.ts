import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Siswa from "@/models/Siswa";
import Guru from "@/models/Guru";
import Berita from "@/models/Berita";
import Dokumen from "@/models/Dokumen";

export async function GET() {
  try {
    await connectDB();

    // 1. Hitung Total Data (Parallel Promise agar cepat)
    const [
      totalSiswa,
      totalGuru,
      totalBerita,
      totalDokumen,
      siswaIPA,
      siswaIPS,
      recentSiswa,
      recentGuru,
      recentBerita,
      recentDokumen
    ] = await Promise.all([
      Siswa.countDocuments({ status: true }), // Hanya siswa aktif
      Guru.countDocuments({ status: true }),
      Berita.countDocuments({ status: "Published" }),
      Dokumen.countDocuments(),
      // Statistik Jurusan
      Siswa.countDocuments({ jurusan: "IPA", status: true }),
      Siswa.countDocuments({ jurusan: "IPS", status: true }),
      // Ambil Data Terbaru untuk Feed
      Siswa.find().sort({ createdAt: -1 }).limit(3).select("nama createdAt"),
      Guru.find().sort({ createdAt: -1 }).limit(3).select("nama createdAt"),
      Berita.find().sort({ createdAt: -1 }).limit(3).select("judul createdAt"),
      Dokumen.find().sort({ createdAt: -1 }).limit(3).select("judul createdAt"),
    ]);

    // 2. Olah Data "Recent Activity"
    // Kita gabungkan semua data terbaru dan beri label
    const activities = [
      ...recentSiswa.map(i => ({ type: "siswa", label: "Siswa Baru", desc: `Mendaftarkan ${i.nama}`, time: i.createdAt })),
      ...recentGuru.map(i => ({ type: "guru", label: "Guru Baru", desc: `Menambahkan ${i.nama}`, time: i.createdAt })),
      ...recentBerita.map(i => ({ type: "berita", label: "Berita", desc: `Menerbitkan "${i.judul}"`, time: i.createdAt })),
      ...recentDokumen.map(i => ({ type: "dokumen", label: "Dokumen", desc: `Upload file "${i.judul}"`, time: i.createdAt })),
    ];

    // Urutkan lagi gabungan tadi berdasarkan waktu (Terbaru diatas)
    const sortedActivities = activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

    return NextResponse.json({
      success: true,
      stats: {
        siswa: totalSiswa,
        guru: totalGuru,
        berita: totalBerita,
        dokumen: totalDokumen,
        chart: [siswaIPA, siswaIPS] // Data untuk Pie Chart
      },
      activities: sortedActivities
    });

  } catch (error) {
    return NextResponse.json({ message: "Gagal memuat dashboard" }, { status: 500 });
  }
}