import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Siswa from "@/models/Siswa";
import { writeFile } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { createLog } from "@/lib/logger";

// Helper: Hitung Tahun Ajaran Saat Ini
const getCurrentSchoolYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1-12
  // Jika bulan >= 7 (Juli), tahun ajaran mulai tahun ini (Misal Juli 2025 -> TA 2025/2026)
  // Jika bulan < 7, tahun ajaran mulai tahun lalu (Misal Jan 2026 -> TA 2025/2026)
  return month >= 7 ? year : year - 1;
};

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("q") || "";
    const statusFilter = searchParams.get("status") || "aktif"; // Default 'aktif'

    const query: any = {};
    const currentSchoolYear = getCurrentSchoolYear();

    // 1. Filter Pencarian Teks
    if (search) {
      query.$or = [
        { nama: { $regex: search, $options: "i" } },
        { nisn: { $regex: search, $options: "i" } },
        { jurusan: { $regex: search, $options: "i" } },
        { rombel: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Filter Status (Aktif vs Alumni)
    // Siswa Aktif = Kelas 10, 11, 12
    // Rumus: Angkatan >= (TahunSekarang - 2)
    // Contoh: Tahun 2025. Aktif = 2025(X), 2024(XI), 2023(XII).
    if (statusFilter === "aktif") {
      query.angkatan = { $gte: currentSchoolYear - 2 };
    } 
    else if (statusFilter === "alumni") {
      query.angkatan = { $lt: currentSchoolYear - 2 };
    }
    // Jika 'all', tidak ada filter angkatan

    const skip = (page - 1) * limit;

    const [dataSiswa, totalData] = await Promise.all([
      Siswa.find(query)
        .sort({ angkatan: -1, nama: 1 }) // Yang termuda paling atas
        .skip(skip)
        .limit(limit),
      Siswa.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return NextResponse.json({
      success: true,
      data: dataSiswa,
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

// POST DIUPDATE: Handle Multipart Form Data (File Upload)
export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    // Jika User bukan SuperAdmin DAN bukan Editor (Berarti dia Osis), tolak.
    if (!user || (user.role !== "SuperAdmin" && user.role !== "Editor")) {
      return NextResponse.json({ message: "Akses ditolak. Peran Anda tidak diizinkan." }, { status: 403 });
    }

    // 1. Ambil data sebagai FormData (Bukan JSON lagi)
    const formData = await req.formData();

    // Cek apakah ini Bulk Insert (Excel) - Indikatornya misal ada field 'isBulk' atau cek struktur
    // Karena FormData susah kirim Array object kompleks, biasanya Excel diupload filenya.
    // TAPI untuk kesederhanaan, jika request JSON (Excel import) dia akan error di req.formData()
    // Jadi kita perlu trik sedikit.
    
    // PENTING: Untuk Import Excel, Frontend tetap kirim JSON. 
    // Untuk Tambah Siswa Manual, Frontend kirim FormData.
    // Kita cek Content-Type header.
    const contentType = req.headers.get("content-type") || "";

    // --- KASUS 1: IMPORT EXCEL (JSON) ---
    if (contentType.includes("application/json")) {
       const body = await req.json(); // Baca ulang sebagai JSON
       // Logic Bulk Insert sama seperti sebelumnya...
       try {
         const result = await Siswa.insertMany(body, { ordered: false });
         return NextResponse.json({ success: true, message: `${result.length} data berhasil diimport!` }, { status: 201 });
       } catch (error: any) {
          return NextResponse.json({ success: true, message: "Import selesai. Duplikat dilewati." }, { status: 201 });
       }
    }

    // --- KASUS 2: INPUT MANUAL (FormData + File) ---
    
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
    
    // Ambil File Foto
    const file = formData.get("foto") as File | null;

    // Validasi
    const existingSiswa = await Siswa.findOne({ nisn });
    if (existingSiswa) {
      return NextResponse.json({ success: false, message: "NISN sudah terdaftar!" }, { status: 400 });
    }

    // --- LOGIC UPLOAD KE LOCAL STORAGE ---
    let fotoUrl = ""; 

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Buat nama file unik (misal: 1700123123-budi.jpg) agar tidak bentrok
      // Kita bersihkan nama file dari spasi
      const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
      const filename = `${Date.now()}-${cleanName}`;
      
      // Tentukan lokasi simpan: folder public/uploads/siswa
      const uploadDir = path.join(process.cwd(), "public/uploads/siswa");
      const filePath = path.join(uploadDir, filename);

      // Tulis file ke hard disk
      await writeFile(filePath, buffer);

      // Simpan URL publik ke database (tanpa 'public')
      fotoUrl = `/uploads/siswa/${filename}`;
    }

    // Simpan ke MongoDB
    const newSiswa = await Siswa.create({
      nama,
      nisn,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      jurusan,
      rombel,
      angkatan,
      foto: fotoUrl, // URL path lokal (/uploads/siswa/...)
      status: true
    });

    if (user) { // user didapat dari getCurrentUser()
      await createLog({
        userId: user.userId, // Dari token
        namaUser: user.nama,
        action: "CREATE",
        target: "Siswa",
        details: `Menambahkan siswa baru: ${newSiswa.nama} (${newSiswa.nisn})`
      });
    }

    return NextResponse.json({ success: true, message: "Berhasil!", data: newSiswa }, { status: 201 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}