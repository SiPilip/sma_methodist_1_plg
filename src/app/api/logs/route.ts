import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    
    // 1. Cek Security
    const user = await getCurrentUser();
    if (!user || user.role !== "SuperAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 2. Ambil Data (Limit 100 log terakhir)
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 }) // Terbaru diatas
      .limit(100);

    return NextResponse.json({ success: true, data: logs });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}