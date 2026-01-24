import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GuruModel from "@/models/Guru";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    // Validasi apakah ID adalah format ObjectId yang valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    // Cari guru berdasarkan ID dan status aktif
    const guru = await GuruModel.findOne({ _id: id, status: true }).lean();

    // Jika tidak ditemukan, kirim 404
    if (!guru) {
      return NextResponse.json(
        { success: false, message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: guru,
    });
  } catch (error) {
    console.error(`Error API Guru (ID: ${params.id}):`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
