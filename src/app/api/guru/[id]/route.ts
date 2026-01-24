import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Guru from "@/models/Guru";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { isValidObjectId } from "mongoose"; // Import Validasi
import { getCurrentUser } from "@/lib/auth";
import { createLog } from "@/lib/logger";

type Context = {
  params: Promise<{ id: string }>
};

// GET: Detail 1 Guru
export async function GET(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    // 1. Validasi Format ID
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Format ID tidak valid" }, { status: 400 });
    }

    const guru = await Guru.findById(id);
    
    // 2. Cek Data
    if (!guru) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    
    return NextResponse.json({ success: true, data: guru }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

// PUT: Update Guru
export async function PUT(req: Request, context: Context) {
  const user = await getCurrentUser();
    // Jika User bukan SuperAdmin DAN bukan Editor (Berarti dia Osis), tolak.
  if (!user || (user.role !== "SuperAdmin" && user.role !== "Editor")) {
    return NextResponse.json({ message: "Akses ditolak. Peran Anda tidak diizinkan." }, { status: 403 });
  }
  
  try {
    const { id } = await context.params;
    await connectDB();

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: "Format ID tidak valid" }, { status: 400 });
    }

    const oldGuru = await Guru.findById(id);
    if (!oldGuru) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });

    const formData = await req.formData();

    // Ambil Data Text
    const nama = formData.get("nama");
    const nip = formData.get("nip");
    const jabatan = formData.get("jabatan");
    const kategori = formData.get("kategori");
    const mataPelajaran = formData.get("mataPelajaran");
    const bio = formData.get("bio");
    const email = formData.get("email");
    const noHp = formData.get("noHp");
    const status = formData.get("status") === 'true';

    // Parse Pendidikan
    let pendidikan = oldGuru.pendidikan; 
    const pendidikanString = formData.get("pendidikan") as string;
    if (pendidikanString) {
      try { pendidikan = JSON.parse(pendidikanString); } catch (e) {}
    }

    // Handle Foto
    const file = formData.get("foto") as File | null;
    let fotoUrl = oldGuru.foto;

    if (file && file.size > 0) {
      // Hapus Foto Lama
      if (oldGuru.foto && oldGuru.foto.startsWith("/uploads")) {
        try {
          const oldPath = path.join(process.cwd(), "public", oldGuru.foto);
          await unlink(oldPath);
        } catch (err) {}
      }

      // Upload Foto Baru
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `guru-${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/guru");
      const filePath = path.join(uploadDir, filename);
      
      await writeFile(filePath, buffer);
      fotoUrl = `/uploads/guru/${filename}`;
    }

    // Update DB
    const updatedGuru = await Guru.findByIdAndUpdate(
      id,
      {
        nama, nip, jabatan, kategori, mataPelajaran, bio, email, noHp, status,
        pendidikan, foto: fotoUrl
      },
      { new: true }
    );

    if (user) { 
      await createLog({
        userId: user.userId, 
        namaUser: user.nama,
        action: "UPDATE",
        target: "Guru",
        details: `Mengubah Guru: ${updatedGuru.nama} (${updatedGuru.nip})`
      });
    }

    return NextResponse.json({ success: true, message: "Data berhasil diperbarui", data: updatedGuru }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Hapus Guru
export async function DELETE(req: Request, context: Context) {
  const user = await getCurrentUser();
    // Jika User bukan SuperAdmin DAN bukan Editor (Berarti dia Osis), tolak.
  if (!user || (user.role !== "SuperAdmin" && user.role !== "Editor")) {
    return NextResponse.json({ message: "Akses ditolak. Peran Anda tidak diizinkan." }, { status: 403 });
  }
  
  try {
    const { id } = await context.params;
    await connectDB();

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: "Format ID tidak valid" }, { status: 400 });
    }

    const guru = await Guru.findById(id);
    if (!guru) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });

    // Hapus File Foto
    if (guru.foto && guru.foto.startsWith("/uploads")) {
      try {
        const filePath = path.join(process.cwd(), "public", guru.foto);
        await unlink(filePath);
      } catch (err) {}
    }
    
    if (user) { 
      await createLog({
        userId: user.userId, 
        namaUser: user.nama,
        action: "DELETE",
        target: "Guru",
        details: `Menghapus Guru: ${guru.nama} (${guru.nip})`
      });
    }
    
    await Guru.findByIdAndDelete(id);


    return NextResponse.json({ success: true, message: "Data berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus data" }, { status: 500 });
  }
}