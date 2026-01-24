import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Helper: Cek apakah user adalah SuperAdmin
const isSuperAdmin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "rahasia");
    return decoded.role === "SuperAdmin";
  } catch (e) {
    return false;
  }
};

// GET: Ambil Semua User
export async function GET() {
  await connectDB();
  // Validasi Role (Opsional: Jika ingin strict, uncomment baris bawah)
  // if (!await isSuperAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  // Ambil semua user tapi sembunyikan password
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: users });
}

// POST: Tambah User Baru
export async function POST(req: Request) {
  try {
    await connectDB();
    
    if (!await isSuperAdmin()) {
      return NextResponse.json({ message: "Hanya SuperAdmin yang boleh menambah user!" }, { status: 403 });
    }

    const body = await req.json();
    const { username, password, nama, role } = body;

    // Cek duplikat
    const exist = await User.findOne({ username });
    if (exist) return NextResponse.json({ message: "Username sudah dipakai" }, { status: 400 });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      nama,
      role,
      isActive: true
    });

    return NextResponse.json({ success: true, message: "User berhasil dibuat", data: newUser });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}