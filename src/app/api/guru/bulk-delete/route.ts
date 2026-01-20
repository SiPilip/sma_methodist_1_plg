import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Guru from "@/models/Guru";
import { unlink } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "Tidak ada data yang dipilih" }, { status: 400 });
    }

    // 1. Ambil data untuk hapus foto
    const targets = await Guru.find({ _id: { $in: ids } });

    for (const item of targets) {
      if (item.foto && item.foto.startsWith("/uploads")) {
        try {
          const filePath = path.join(process.cwd(), "public", item.foto);
          await unlink(filePath);
        } catch (err) {
          console.warn(`Gagal hapus file ${item.foto}`);
        }
      }
    }

    // 2. Hapus Database
    await Guru.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      message: `${ids.length} data berhasil dihapus` 
    });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}