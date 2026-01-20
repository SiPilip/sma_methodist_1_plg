import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises"; // Tambahkan 'mkdir'
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diupload" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik
    const filename = `content-${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
    
    // Tentukan lokasi folder
    const uploadDir = path.join(process.cwd(), "public/uploads/content");
    const filePath = path.join(uploadDir, filename);

    // --- PERBAIKAN DI SINI ---
    // Cek apakah folder ada? Jika tidak, buat foldernya (recursive: true artinya buat folder bertingkat sekaligus)
    await mkdir(uploadDir, { recursive: true });
    // -------------------------

    await writeFile(filePath, buffer);

    // Kembalikan URL Gambar
    const imageUrl = `/uploads/content/${filename}`;
    
    return NextResponse.json({ url: imageUrl }, { status: 201 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Gagal upload gambar" }, { status: 500 });
  }
}