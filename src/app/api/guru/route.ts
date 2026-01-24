import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Guru from "@/models/Guru";
import { writeFile } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { createLog } from "@/lib/logger";

// --- GET: List Guru dengan Pagination & Search ---
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("q") || "";
    const kategori = searchParams.get("kategori") || ""; // Filter Guru vs Karyawan

    const query: any = {};

    // 1. Filter Pencarian
    if (search) {
      query.$or = [
        { nama: { $regex: search, $options: "i" } },
        { nip: { $regex: search, $options: "i" } },
        { jabatan: { $regex: search, $options: "i" } },
        { mataPelajaran: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Filter Kategori (Jika ada)
    if (kategori && kategori !== "Semua") {
      query.kategori = kategori;
    }

    const skip = (page - 1) * limit;

    const [dataGuru, totalData] = await Promise.all([
      Guru.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Guru.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return NextResponse.json({
      success: true,
      data: dataGuru,
      pagination: {
        totalData,
        totalPages,
        currentPage: page,
        limit,
      },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

// --- POST: Tambah Guru Baru (Multipart Form Data) ---
export async function POST(req: Request) {
  const user = await getCurrentUser();
    // Jika User bukan SuperAdmin DAN bukan Editor (Berarti dia Osis), tolak.
  if (!user || (user.role !== "SuperAdmin" && user.role !== "Editor")) {
    return NextResponse.json({ message: "Akses ditolak. Peran Anda tidak diizinkan." }, { status: 403 });
  }
  
  try {
    await connectDB();
    
    // Cek Tipe Konten
    const contentType = req.headers.get("content-type") || "";

    // A. KASUS IMPORT EXCEL (JSON Array)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      
      // Validasi sederhana
      if (!Array.isArray(body)) {
        return NextResponse.json({ message: "Format data harus array" }, { status: 400 });
      }

      // Bulk Insert (ordered: false agar jika 1 gagal, yang lain tetap lanjut)
      try {
        const result = await Guru.insertMany(body, { ordered: false });
        return NextResponse.json({ 
          success: true, 
          message: `${result.length} data guru berhasil diimport!` 
        }, { status: 201 });
      } catch (error: any) {
        // Biasanya error karena NIP duplikat
        return NextResponse.json({ 
          success: true, 
          message: "Import selesai. Data dengan NIP duplikat dilewati." 
        }, { status: 201 });
      }
    }

    // B. KASUS INPUT MANUAL (Multipart FormData)
    const formData = await req.formData();

    // Cek NIP Duplikat
    const nip = formData.get("nip") as string;
    const existingGuru = await Guru.findOne({ nip });
    if (existingGuru) {
      return NextResponse.json({ success: false, message: "NIP sudah terdaftar!" }, { status: 400 });
    }

    // Ambil field text
    const nama = formData.get("nama");
    const jabatan = formData.get("jabatan");
    const kategori = formData.get("kategori");
    const mataPelajaran = formData.get("mataPelajaran");
    const bio = formData.get("bio");
    const email = formData.get("email");
    const noHp = formData.get("noHp");
    
    // Parsing Pendidikan
    let pendidikan = [];
    const pendidikanString = formData.get("pendidikan") as string;
    if (pendidikanString) {
      try { pendidikan = JSON.parse(pendidikanString); } catch (e) {}
    }

    // Handle Upload Foto
    let fotoUrl = "";
    const file = formData.get("foto") as File | null;
    
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
      const filename = `guru-${Date.now()}-${cleanName}`;
      
      const uploadDir = path.join(process.cwd(), "public/uploads/guru");
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      fotoUrl = `/uploads/guru/${filename}`;
    }

    const newGuru = await Guru.create({
      nama, nip, jabatan, kategori, mataPelajaran, bio, email, noHp,
      pendidikan, foto: fotoUrl, status: true
    });

    if (user) { 
      await createLog({
        userId: user.userId, 
        namaUser: user.nama,
        action: "CREATE",
        target: "Guru",
        details: `Menambah Guru: ${newGuru.nama} (${newGuru.nip})`
      });
    }

    return NextResponse.json({ success: true, message: "Berhasil menambahkan data!", data: newGuru }, { status: 201 });

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}