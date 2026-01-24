import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Kelulusan from "@/models/Kelulusan";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { isValidObjectId } from "mongoose";
import { getCurrentUser } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

// PUT: Update Status & Upload SKL
export async function PUT(req: Request, context: Context) {
  const user = await getCurrentUser();
    // Jika User bukan SuperAdmin DAN bukan Editor (Berarti dia Osis), tolak.
  if (!user || (user.role !== "SuperAdmin" && user.role !== "Editor")) {
    return NextResponse.json({ message: "Akses ditolak. Peran Anda tidak diizinkan." }, { status: 403 });
  }
  
  try {
    const { id } = await context.params;
    await connectDB();

    if (!isValidObjectId(id)) return NextResponse.json({ message: "ID Invalid" }, { status: 400 });

    const existingData = await Kelulusan.findById(id);
    if (!existingData) return NextResponse.json({ message: "Data not found" }, { status: 404 });

    const formData = await req.formData();
    const status = formData.get("status") as string;
    const nilaiRataRata = formData.get("nilaiRataRata") as string;
    const catatan = formData.get("catatan") as string;
    const isPublished = formData.get("isPublished") === "true"; // Approve switch

    // Handle Upload SKL
    const file = formData.get("fileSkl") as File | null;
    let fileSklUrl = existingData.fileSklUrl;

    if (file && file.size > 0) {
      // Hapus file lama jika ada
      if (existingData.fileSklUrl) {
        try {
          await unlink(path.join(process.cwd(), "public", existingData.fileSklUrl));
        } catch (e) {}
      }

      const bytes = await file.arrayBuffer();
      const ext = path.extname(file.name);
      // Nama file: SKL-NISN.pdf (Biar rapi)
      const filename = `SKL-${existingData.nisn}${ext}`;
      
      const uploadDir = path.join(process.cwd(), "public/uploads/skl");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      
      fileSklUrl = `/uploads/skl/${filename}`;
    }

    const updated = await Kelulusan.findByIdAndUpdate(
      id,
      { status, nilaiRataRata, catatan, isPublished, fileSklUrl },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}