import AuditLog from "@/models/AuditLog";
import { headers } from "next/headers";

interface LogParams {
  userId: string;
  namaUser: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  target: string;  // Misal: "Siswa", "Guru", "Berita"
  details: string; // Misal: "Menambahkan siswa baru: Budi"
}

export const createLog = async ({ userId, namaUser, action, target, details }: LogParams) => {
  try {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "Unknown";
    // IP Address agak tricky di Next.js (tergantung proxy), kita ambil simpelnya
    const ip = headerList.get("x-forwarded-for") || "Unknown";

    await AuditLog.create({
      userId,
      namaUser,
      action,
      target,
      details,
      userAgent,
      ipAddress: ip
    });
  } catch (error) {
    console.error("Gagal mencatat log:", error);
    // Jangan throw error, karena log error gak boleh bikin aplikasi utama crash
  }
};