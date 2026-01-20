import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Siswa from "@/models/Siswa";
import { writeFile, unlink } from "fs/promises";
import path from "path";

type Context = {
  params: Promise<{ id: string }>
};

// GET: Ambil Detail 1 Siswa (Tetap Sama)
export async function GET(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const siswa = await Siswa.findById(id);
    if (!siswa) return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: siswa }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

// PUT: Update Data Siswa (Support File Upload & Delete Old File)
export async function PUT(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    // 1. Ambil Data Lama Dulu (Untuk cek foto lama)
    const oldSiswa = await Siswa.findById(id);
    if (!oldSiswa) return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });

    // 2. Baca FormData
    const formData = await req.formData();
    
    // Ambil field text
    const nama = formData.get("nama");
    const nisn = formData.get("nisn");
    const tempatLahir = formData.get("tempatLahir");
    const tanggalLahir = formData.get("tanggalLahir");
    const jenisKelamin = formData.get("jenisKelamin");
    const agama = formData.get("agama");
    const jurusan = formData.get("jurusan");
    const rombel = formData.get("rombel");
    const angkatan = formData.get("angkatan");
    const status = formData.get("status") === 'true';

    // Ambil File Foto Baru (Jika ada)
    const file = formData.get("foto") as File | null;
    
    let fotoUrl = oldSiswa.foto; // Default pakai foto lama

    // 3. Logic Ganti Foto
    if (file && file.size > 0) {
      // A. Hapus Foto Lama (Jika ada dan bukan link eksternal)
      if (oldSiswa.foto && oldSiswa.foto.startsWith("/uploads")) {
        try {
          // Hapus awalan '/' agar path.join bekerja dari root project
          const oldPath = path.join(process.cwd(), "public", oldSiswa.foto); 
          await unlink(oldPath);
          console.log("🗑️ Foto lama dihapus:", oldPath);
        } catch (err) {
          console.warn("⚠️ Gagal hapus foto lama (mungkin file sudah hilang):", err);
        }
      }

      // B. Simpan Foto Baru
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
      const filename = `${Date.now()}-${cleanName}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/siswa");
      const filePath = path.join(uploadDir, filename);
      
      await writeFile(filePath, buffer);
      fotoUrl = `/uploads/siswa/${filename}`;
    }

    // 4. Update Database
    const updatedSiswa = await Siswa.findByIdAndUpdate(
      id, 
      {
        nama, nisn, tempatLahir, tanggalLahir, jenisKelamin, agama,
        jurusan, rombel, angkatan, status, foto: fotoUrl
      }, 
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Data berhasil diperbarui", data: updatedSiswa }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Gagal update data" }, { status: 500 });
  }
}

// DELETE: Hapus Siswa & File Fotonya
export async function DELETE(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    // 1. Cari Data Dulu
    const siswa = await Siswa.findById(id);
    if (!siswa) return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });

    // 2. Hapus File Foto Fisik (Jika ada)
    if (siswa.foto && siswa.foto.startsWith("/uploads")) {
      try {
        const filePath = path.join(process.cwd(), "public", siswa.foto);
        await unlink(filePath);
        console.log("🗑️ File foto dihapus:", filePath);
      } catch (err) {
        console.warn("⚠️ File foto tidak ditemukan atau gagal dihapus.");
      }
    }

    // 3. Hapus Data di Database
    await Siswa.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Siswa & File Foto berhasil dihapus permanen" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus data" }, { status: 500 });
  }
}