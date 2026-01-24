import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Berita from "@/models/Berita";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { isValidObjectId } from "mongoose"; // FIX: Import langsung fungsinya

type Context = { params: Promise<{ id: string }> };

// Helper Slug
const createSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-") + "-" + Date.now();
};

export async function GET(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    // 1. Validasi Format ID MongoDB
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Format ID tidak valid" }, { status: 400 });
    }

    const berita = await Berita.findById(id);
    
    // 2. Cek Data
    if (!berita) {
      return NextResponse.json({ message: "Berita tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: berita }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error server" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    // Validasi ID
    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: "Format ID tidak valid" }, { status: 400 });
    }

    const oldBerita = await Berita.findById(id);
    if (!oldBerita) return NextResponse.json({ message: "Not Found" }, { status: 404 });

    const formData = await req.formData();
    const judul = formData.get("judul") as string;
    const konten = formData.get("konten") as string;
    const kategori = formData.get("kategori") as string;
    const status = formData.get("status") as string;

    // Cek update slug
    let slug = oldBerita.slug;
    if (judul !== oldBerita.judul) {
      slug = createSlug(judul);
    }

    // Handle Thumbnail
    let thumbnail = oldBerita.thumbnail;
    const file = formData.get("thumbnail") as File | null;

    if (file && file.size > 0) {
      if (oldBerita.thumbnail && oldBerita.thumbnail.startsWith("/uploads")) {
        try {
          await unlink(path.join(process.cwd(), "public", oldBerita.thumbnail));
        } catch (e) {}
      }
      
      const bytes = await file.arrayBuffer();
      const filename = `blog-${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/berita");
      // Note: Folder sudah pasti ada karena dibuat saat Upload Image
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      thumbnail = `/uploads/berita/${filename}`;
    }

    const updatedBerita = await Berita.findByIdAndUpdate(
      id,
      { judul, slug, konten, kategori, status, thumbnail: thumbnail },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Update berhasil", data: updatedBerita }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: "Format ID tidak valid" }, { status: 400 });
    }

    const berita = await Berita.findById(id);
    if (!berita) return NextResponse.json({ message: "Not Found" }, { status: 404 });

    if (berita.thumbnail && berita.thumbnail.startsWith("/uploads")) {
      try {
        await unlink(path.join(process.cwd(), "public", berita.thumbnail));
      } catch (e) {}
    }

    await Berita.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Berita dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
  }
}