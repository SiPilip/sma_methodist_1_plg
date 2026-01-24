import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { verifyPassword, generateToken } from "@/lib/auth";
import { serialize } from "cookie"; // Helper untuk set cookie

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    // 1. Cari User
    // Kita cari yang isActive: true saja. Kalau dibanned (false), gak bisa login.
    const user = await User.findOne({ username, isActive: true });
    
    if (!user) {
      return NextResponse.json({ message: "Username tidak ditemukan atau akun non-aktif" }, { status: 401 });
    }

    // 2. Cek Password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // 3. Login Sukses! Update Last Login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // 4. Catat di CCTV (Audit Log)
    await AuditLog.create({
      userId: user._id,
      namaUser: user.nama,
      action: "LOGIN",
      target: "System",
      details: "User berhasil login",
      userAgent: req.headers.get("user-agent") || "Unknown"
    });

    // 5. Generate Token
    // Payload minimal saja biar token ringan
    const tokenPayload = { 
      userId: user._id, 
      username: user.username, 
      role: user.role, 
      nama: user.nama 
    };
    
    const token = generateToken(tokenPayload);

    // 6. Set Cookie (Ini kuncinya!)
    // Kita simpan token yang sama di cookie sebagai "Session"
    const serializedCookie = serialize("admin_session", token, {
      httpOnly: true,  // JavaScript browser GAK BISA baca ini (Anti-XSS)
      secure: process.env.NODE_ENV === "production", // Hanya HTTPS di production
      sameSite: "strict", // Anti-CSRF
      maxAge: 60 * 60 * 24, // 1 Hari (sesuai exp token)
      path: "/", // Berlaku di seluruh web
    });

    // 7. Kirim Respon
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: tokenPayload,
      token: token // Access Token buat Frontend (opsional jika pakai cookie-only auth, tapi bagus buat API call)
    });

    // Tempel Cookie di header response
    response.headers.set("Set-Cookie", serializedCookie);

    return response;

  } catch (error: any) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}