import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GuruModel from "@/models/Guru";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const kategori = searchParams.get("kategori") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = 12; // 12 Guru per halaman
    const skip = (page - 1) * limit;

    // --- Build Query ---
    const query: any = {
      status: true, // Hanya tampilkan guru & karyawan yang aktif
    };

    // 1. Filter Kategori
    if (kategori === "Guru" || kategori === "Karyawan") {
      query.kategori = kategori;
    }

    // 2. Filter Pencarian (Nama, NIP, atau Jabatan)
    if (q) {
      query.$or = [
        { nama: { $regex: q, $options: "i" } },
        { nip: { $regex: q, $options: "i" } },
        { jabatan: { $regex: q, $options: "i" } },
      ];
    }

    // --- Eksekusi Query ---
    const [gurus, totalDocs] = await Promise.all([
      GuruModel.find(query)
        .sort({ nama: 1 }) // Urutkan berdasarkan nama A-Z
        .skip(skip)
        .limit(limit)
        .lean(),
      GuruModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return NextResponse.json({
      success: true,
      data: gurus,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalDocs,
      },
    });
  } catch (error) {
    console.error("Error API Guru:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
