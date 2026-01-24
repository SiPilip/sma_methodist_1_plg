import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DokumenModel from "@/models/Dokumen"; 

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const q = searchParams.get("q") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = 10; // 10 Dokumen per halaman
    const skip = (page - 1) * limit; // Hitung berapa data yang dilewati
    
    // --- QUERY DB YANG BENAR ---
    
    // 1. Filter Pencarian (Judul atau Deskripsi)
    const query = q 
      ? { 
          $or: [
            { judul: { $regex: q, $options: "i" } },
            { deskripsi: { $regex: q, $options: "i" } } // Opsional: cari di deskripsi juga
          ] 
        } 
      : {};

    // 2. Eksekusi Query Parallel (Hitung Total & Ambil Data)
    const [docs, totalDocs] = await Promise.all([
      DokumenModel.find(query)
        .sort({ createdAt: -1 }) // Urutkan dari yang terbaru
        .skip(skip)              // Lewati data halaman sebelumnya
        .limit(limit)            // Ambil cuma 10
        .lean(),                 // Konversi ke object JavaScript murni (lebih ringan)
      DokumenModel.countDocuments(query) // Hitung total dokumen yang cocok
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return NextResponse.json({
      success: true,
      data: docs,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalDocs
      }
    });

  } catch (error) {
    console.error("Error API Dokumen:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}