import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Guru from "@/models/Guru";
import { writeFile, unlink } from "fs/promises";
import path from "path";

type Context = {
  params: Promise<{ id: string }>
};

// GET: Detail 1 Guru
export async function GET(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const guru = await Guru.findById(id);
    if (!guru) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: guru }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

// PUT: Update Guru (Handle Foto & Pendidikan)
export async function PUT(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

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
    let pendidikan = oldGuru.pendidikan; // Default pakai lama
    const pendidikanString = formData.get("pendidikan") as string;
    if (pendidikanString) {
      try {
        pendidikan = JSON.parse(pendidikanString);
      } catch (e) { console.error("Parse error", e); }
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
      await writeFile(path.join(uploadDir, filename), buffer);
      fotoUrl = `/uploads/guru/${filename}`;
    }

    // Update DB
    const updatedGuru = await Guru.findByIdAndUpdate(
      id,
      {
        nama, nip, jabatan, kategori, mataPelajaran, bio, email, noHp, status,
        pendidikan,
        foto: fotoUrl
      },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Data berhasil diperbarui", data: updatedGuru }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Hapus Guru & Foto
export async function DELETE(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    const guru = await Guru.findById(id);
    if (!guru) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });

    // Hapus File Foto
    if (guru.foto && guru.foto.startsWith("/uploads")) {
      try {
        const filePath = path.join(process.cwd(), "public", guru.foto);
        await unlink(filePath);
      } catch (err) {}
    }

    await Guru.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Data berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus data" }, { status: 500 });
  }
}