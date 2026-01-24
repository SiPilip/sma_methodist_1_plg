import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DokumenModel from "@/models/Dokumen";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Cari dan update (Increment downloadCount + 1)
    const updatedDoc = await DokumenModel.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } }, // $inc adalah operator MongoDB untuk increment
      { new: true } // Return data terbaru
    );

    if (!updatedDoc) {
      return NextResponse.json({ message: "Dokumen tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedDoc });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}