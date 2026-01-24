import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Siswa from "@/models/Siswa";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { isValidObjectId } from "mongoose"; // Import Validasi
import { getCurrentUser } from "@/lib/auth";
import { createLog } from "@/lib/logger";

type Context = {
  params: Promise<{ id: string }>
};

// GET
export async function GET(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Format ID tidak valid" }, { status: 400 });
    }

    const siswa = await Siswa.findById(id);
    if (!siswa) return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: siswa }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

// PUT
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

    const oldSiswa = await Siswa.findById(id);
    if (!oldSiswa) return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });

    const formData = await req.formData();
    
    // Ambil Data
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

    // File Foto
    const file = formData.get("foto") as File | null;
    let fotoUrl = oldSiswa.foto;

    if (file && file.size > 0) {
      if (oldSiswa.foto && oldSiswa.foto.startsWith("/uploads")) {
        try {
          const oldPath = path.join(process.cwd(), "public", oldSiswa.foto); 
          await unlink(oldPath);
        } catch (err) {}
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/siswa");
      const filePath = path.join(uploadDir, filename);
      
      await writeFile(filePath, buffer);
      fotoUrl = `/uploads/siswa/${filename}`;
    }

    const updatedSiswa = await Siswa.findByIdAndUpdate(
      id, 
      {
        nama, nisn, tempatLahir, tanggalLahir, jenisKelamin, agama,
        jurusan, rombel, angkatan, status, foto: fotoUrl
      }, 
      { new: true }
    );

    if (user) { // user didapat dari getCurrentUser()
      await createLog({
        userId: user.userId, // Dari token
        namaUser: user.nama,
        action: "UPDATE",
        target: "Siswa",
        details: `Mengubah siswa: ${updatedSiswa.nama} (${updatedSiswa.nisn})`
      });
    }

    return NextResponse.json({ success: true, message: "Data berhasil diperbarui", data: updatedSiswa }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Gagal update data" }, { status: 500 });
  }
}

// DELETE
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

    const siswa = await Siswa.findById(id);
    if (!siswa) return NextResponse.json({ message: "Siswa tidak ditemukan" }, { status: 404 });

    if (siswa.foto && siswa.foto.startsWith("/uploads")) {
      try {
        const filePath = path.join(process.cwd(), "public", siswa.foto);
        await unlink(filePath);
      } catch (err) {}
    }

    if (user) { // user didapat dari getCurrentUser()
      await createLog({
        userId: user.userId, // Dari token
        namaUser: user.nama,
        action: "DELETE",
        target: "Siswa",
        details: `Menghapus siswa: ${siswa.nama} (${siswa.nisn})`
      });
    }

    await Siswa.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Siswa berhasil dihapus" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus data" }, { status: 500 });
  }
}