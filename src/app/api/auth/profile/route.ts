import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";
import { createLog } from "@/lib/logger";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { nama, currentPassword, newPassword } = body;

    // 1. Ambil data user asli dari DB
    const userInDb = await User.findById(currentUser.userId);
    if (!userInDb) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    // 2. Siapkan Data Update
    const updateData: any = {};
    let logDetails = "";

    // A. Update Nama
    if (nama && nama !== userInDb.nama) {
      updateData.nama = nama;
      logDetails += `Mengubah nama dari "${userInDb.nama}" menjadi "${nama}". `;
    }

    // B. Update Password (Jika diisi)
    if (newPassword) {
      // Validasi: Password Lama Wajib Diisi
      if (!currentPassword) {
        return NextResponse.json({ message: "Harap masukkan password lama untuk keamanan." }, { status: 400 });
      }

      // Validasi: Password Lama Cocok Gak?
      const isMatch = await verifyPassword(currentPassword, userInDb.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Password lama salah!" }, { status: 400 });
      }

      // Hash Password Baru
      updateData.password = await hashPassword(newPassword);
      logDetails += "Mengubah password. ";
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Tidak ada perubahan." }, { status: 400 });
    }

    // 3. Eksekusi Update
    await User.findByIdAndUpdate(currentUser.userId, updateData);

    // 4. Catat Log (Penting!)
    await createLog({
      userId: currentUser.userId,
      namaUser: currentUser.username, // Pakai username statis karena nama mungkin berubah
      action: "UPDATE",
      target: "Profile",
      details: logDetails.trim()
    });

    return NextResponse.json({ success: true, message: "Profil berhasil diperbarui!" });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}