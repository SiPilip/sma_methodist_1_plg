import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Berita from "@/models/Berita";
import { writeFile } from "fs/promises";
import path from "path";

// Helper: Membuat Slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Hapus karakter aneh
    .replace(/\s+/g, "-")        // Spasi jadi dash
    .replace(/-+/g, "-")         // Hapus dash berlebih
    + "-" + Date.now();          // Tambah timestamp agar unik
};

// GET: List Berita
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6"); // Default 6 per halaman (Grid layout)
    const search = searchParams.get("q") || "";
    const kategori = searchParams.get("kategori") || "";

    const query: any = {};

    if (search) {
      query.$or = [
        { judul: { $regex: search, $options: "i" } },
        { konten: { $regex: search, $options: "i" } }, // Cari juga di isi berita
      ];
    }

    if (kategori && kategori !== "Semua") {
      query.kategori = kategori;
    }

    const skip = (page - 1) * limit;

    const [dataBerita, totalData] = await Promise.all([
      Berita.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Berita.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return NextResponse.json({
      success: true,
      data: dataBerita,
      pagination: { totalData, totalPages, currentPage: page, limit },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil berita" }, { status: 500 });
  }
}

// POST: Tambah Berita
export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const judul = formData.get("judul") as string;
    const konten = formData.get("konten") as string;
    const kategori = formData.get("kategori") as string;
    const status = formData.get("status") as string;
    
    // Auto Generate Slug
    const slug = createSlug(judul);

    // Handle Thumbnail
    let thumbnail = "";
    const file = formData.get("thumbnail") as File | null;
    
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `blog-${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
      
      // Simpan di folder uploads/berita
      const uploadDir = path.join(process.cwd(), "public/uploads/berita");
      // Pastikan folder ini ada! (mkdir manual jika perlu)
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      thumbnail = `/uploads/berita/${filename}`;
    }

    const newBerita = await Berita.create({
      judul,
      slug,
      konten,
      kategori,
      status,
      thumbnail: thumbnail,
      penulis: "Admin", // Hardcode dulu, nanti ambil dari auth
      views: 0
    });

    return NextResponse.json({ success: true, message: "Berita diterbitkan!", data: newBerita }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}