import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Siswa from "@/models/Siswa";
import { unlink } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { createLog } from "@/lib/logger";

export async function POST(req: Request) {
  const user = await getCurrentUser();
    // Jika User bukan SuperAdmin DAN bukan Editor (Berarti dia Osis), tolak.
    if (!user || (user.role !== "SuperAdmin" && user.role !== "Editor")) {
      return NextResponse.json({ message: "Akses ditolak. Peran Anda tidak diizinkan." }, { status: 403 });
    }
  
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "Tidak ada data yang dipilih" }, { status: 400 });
    }

    // 1. Ambil data siswa yang akan dihapus untuk mendapatkan nama file fotonya
    const studentsToDelete: any = await Siswa.find({ _id: { $in: ids } });

    if (user) { // user didapat dari getCurrentUser()
      await createLog({
        userId: user.userId, // Dari token
        namaUser: user.nama,
        action: "CREATE",
        target: "Siswa",
        details: `Menghapus siswa: ${studentsToDelete.nama} (${studentsToDelete.nisn})`
      });
    }

    // 2. Loop dan hapus file fisik jika ada
    for (const siswa of studentsToDelete) {
      if (siswa.foto && siswa.foto.startsWith("/uploads")) {
        try {
          // Hapus file dari folder public/uploads
          const filePath = path.join(process.cwd(), "public", siswa.foto);
          await unlink(filePath);
        } catch (err) {
          console.warn(`Gagal menghapus file ${siswa.foto}:`, err);
          // Lanjut saja meski gagal hapus file (jangan stop proses)
        }
      }
    }

    // 3. Hapus data dari Database
    await Siswa.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      message: `${ids.length} data siswa & file foto berhasil dihapus permanen` 
    });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}