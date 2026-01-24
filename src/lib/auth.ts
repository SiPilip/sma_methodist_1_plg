import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "rahasia";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  try {
    // Pastikan SECRET sama dengan env
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "rahasia");
    return decoded; // { userId, username, role, nama }
  } catch (e) { return null; }
};

// 1. Fungsi Hash Password (Saat Register/Create User)
export const hashPassword = async (plainPassword: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

// 2. Fungsi Cek Password (Saat Login)
export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// 3. Generate Token
export const generateToken = (payload: any) => {
  // Token Access (Pendek: 1 Hari misalnya untuk kemudahan, idealnya 15 menit + Refresh Token)
  // Untuk fase awal ini kita buat 1 Token dulu biar logic tidak terlalu rumit, 
  // nanti bisa di-upgrade ke Dual Token (Refresh + Access)
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
};

// 4. Verify Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};