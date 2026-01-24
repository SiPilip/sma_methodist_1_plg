import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    // 1. Cek apakah sudah ada user?
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return NextResponse.json({ message: "Seed diblokir: Database tidak kosong!" }, { status: 403 });
    }

    // 2. Buat SuperAdmin Pertama
    const passwordHash = await hashPassword("admin123"); // Password Default

    const admin = await User.create({
      username: "admin",
      password: passwordHash,
      nama: "Super Administrator",
      role: "SuperAdmin",
      isActive: true,
    });

    return NextResponse.json({ 
      success: true, 
      message: "SuperAdmin berhasil dibuat! Silakan login dengan user: 'admin' pass: 'admin123'", 
      data: { username: admin.username, role: admin.role } 
    });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}