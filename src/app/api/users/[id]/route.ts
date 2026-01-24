import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type Context = { params: Promise<{ id: string }> };

const isSuperAdmin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "rahasia");
    return decoded.role === "SuperAdmin";
  } catch (e) { return false; }
};

// PUT: Update Data / Reset Password
export async function PUT(req: Request, context: Context) {
  try {
    await connectDB();
    if (!await isSuperAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { id } = await context.params;
    const body = await req.json();
    
    // Siapkan object update
    const updateData: any = {
      nama: body.nama,
      role: body.role,
      isActive: body.isActive
    };

    // Jika ada password baru (Reset Password)
    if (body.password && body.password.length > 0) {
      updateData.password = await hashPassword(body.password);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    return NextResponse.json({ success: true, message: "User diperbarui", data: updatedUser });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE: Hapus User
export async function DELETE(req: Request, context: Context) {
  try {
    await connectDB();
    if (!await isSuperAdmin()) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { id } = await context.params;
    
    // Cegah hapus diri sendiri (Logic sederhana, idealnya cek ID dari token)
    // Tapi di frontend kita akan disable tombol hapus untuk user yang sedang login

    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "User dihapus" });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}