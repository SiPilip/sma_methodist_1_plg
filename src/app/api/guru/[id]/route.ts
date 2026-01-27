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

    // --- Persiapan Update ---
    const updateData: any = { $set: {}, $unset: {} };

    // Data Teks Biasa
    updateData.$set.nama = formData.get("nama");
    updateData.$set.nip = formData.get("nip");
    updateData.$set.jabatan = formData.get("jabatan");
    updateData.$set.kategori = formData.get("kategori");
    updateData.$set.mataPelajaran = formData.get("mataPelajaran");
    updateData.$set.bio = formData.get("bio");
    updateData.$set.email = formData.get("email");
    updateData.$set.noHp = formData.get("noHp");
    updateData.$set.status = formData.get("status") === 'true';

    // Parse Pendidikan
    const pendidikanString = formData.get("pendidikan") as string;
    if (pendidikanString) {
      try { 
        updateData.$set.pendidikan = JSON.parse(pendidikanString); 
      } catch (e) {
        console.error("Gagal parse JSON pendidikan:", e);
      }
    }

    // Handle Wali Kelas
    const waliUntukKelasString = formData.get("waliUntukKelas") as string;
    if (waliUntukKelasString) {
      try {
        updateData.$set.waliUntukKelas = JSON.parse(waliUntukKelasString);
      } catch(e) {
        console.error("Gagal parse JSON wali kelas:", e);
      }
    } else {
      // Jika string kosong, hapus field dari dokumen
      updateData.$unset.waliUntukKelas = "";
    }

    // Handle Foto
    const file = formData.get("foto") as File | null;
    if (file && file.size > 0) {
      if (oldGuru.foto && oldGuru.foto.startsWith("/uploads")) {
        try {
          const oldPath = path.join(process.cwd(), "public", oldGuru.foto);
          await unlink(oldPath);
        } catch (err) {}
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `guru-${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/guru");
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      updateData.$set.foto = `/uploads/guru/${filename}`;
    }

    // Hapus $unset jika tidak ada isinya, agar tidak error
    if (Object.keys(updateData.$unset).length === 0) {
      delete updateData.$unset;
    }

    // Update DB
    const updatedGuru = await Guru.findByIdAndUpdate(id, updateData, { new: true });

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