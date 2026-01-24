import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Dokumen from "@/models/Dokumen";
import { unlink } from "fs/promises";
import path from "path";
import { isValidObjectId } from "mongoose";
import { getCurrentUser } from "@/lib/auth";
import { createLog } from "@/lib/logger";

type Context = { params: Promise<{ id: string }> };

// DELETE: Hapus Dokumen & File Fisik
export async function DELETE(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Format ID Salah" }, { status: 400 });
    }

    const doc = await Dokumen.findById(id);
    if (!doc) return NextResponse.json({ message: "Dokumen tidak ditemukan" }, { status: 404 });

    // Hapus File dari Server
    if (doc.fileUrl && doc.fileUrl.startsWith("/uploads")) {
      try {
        const filePath = path.join(process.cwd(), "public", doc.fileUrl);
        await unlink(filePath);
      } catch (err) {
        console.warn("Gagal hapus file fisik (mungkin sudah hilang):", err);
      }
    }
    

    const user = await getCurrentUser();
    if (user) { 
      await createLog({
        userId: user.userId, 
        namaUser: user.nama,
        action: "DELETE",
        target: "Dokumen",
        details: `Menghapus Dokumen: ${doc.judul} (${doc.kategori})`
      });
    }

    await Dokumen.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Dokumen dihapus permanen" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal hapus" }, { status: 500 });
  }
}

// GET: Hitung Download (Optional: bisa dipanggil saat user klik download)
export async function PATCH(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectDB();
    if (isValidObjectId(id)) {
        await Dokumen.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
    }

    const doc = await Dokumen.findById(id);

    const user = await getCurrentUser();
    if (user) { 
      await createLog({
        userId: user.userId, 
        namaUser: user.nama,
        action: "UPDATE",
        target: "Dokumen",
        details: `Mengubah Dokumen: ${doc.judul} (${doc.kategori})`
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}