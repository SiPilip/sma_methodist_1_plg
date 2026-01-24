import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Dokumen from "@/models/Dokumen";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createLog } from "@/lib/logger";
import { getCurrentUser } from "@/lib/auth";

// Helper: Format Ukuran File (Bytes -> KB/MB)
const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// GET: List Dokumen
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("q") || "";
    const kategori = searchParams.get("kategori") || "";

    const query: any = {};

    if (search) {
      query.$or = [
        { judul: { $regex: search, $options: "i" } },
        { deskripsi: { $regex: search, $options: "i" } },
      ];
    }

    if (kategori && kategori !== "Semua") {
      query.kategori = kategori;
    }

    const skip = (page - 1) * limit;

    const [dataDokumen, totalData] = await Promise.all([
      Dokumen.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Dokumen.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return NextResponse.json({
      success: true,
      data: dataDokumen,
      pagination: { totalData, totalPages, currentPage: page, limit },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

// POST: Upload Dokumen Baru
export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const kategori = formData.get("kategori") as string;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "Wajib upload file!" }, { status: 400 });
    }

    // Validasi Ukuran (Max 10MB misalnya)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "Ukuran file maksimal 10MB" }, { status: 400 });
    }

    // Proses Simpan File
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Bersihkan nama file
    const ext = path.extname(file.name).toLowerCase(); // .pdf
    const originalName = path.basename(file.name, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `doc-${Date.now()}-${originalName}${ext}`;
    
    // Auto Create Folder
    const uploadDir = path.join(process.cwd(), "public/uploads/dokumen");
    await mkdir(uploadDir, { recursive: true });
    
    await writeFile(path.join(uploadDir, filename), buffer);

    // Simpan ke DB
    const newDokumen = await Dokumen.create({
      judul,
      deskripsi,
      kategori,
      fileUrl: `/uploads/dokumen/${filename}`,
      tipeFile: ext.replace(".", "").toUpperCase(), // PDF, DOCX
      ukuranFile: formatSize(file.size),
      downloadCount: 0
    });

    const user = await getCurrentUser();
    if (user) { 
      await createLog({
        userId: user.userId, 
        namaUser: user.nama,
        action: "CREATE",
        target: "Dokumen",
        details: `Menambah Dokumen: ${newDokumen.judul} (${newDokumen.kategori})`
      });
    }

    return NextResponse.json({ success: true, message: "Dokumen berhasil diupload!", data: newDokumen }, { status: 201 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}