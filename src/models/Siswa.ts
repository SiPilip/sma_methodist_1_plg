import mongoose, { Schema, Document } from "mongoose";

export interface ISiswa extends Document {
  nama: string;
  nisn: string;
  // nik & kelas SUDAH DIHAPUS
  tempatLahir?: string;
  tanggalLahir?: Date;
  jenisKelamin: "L" | "P";
  agama?: string;
  jurusan: string; // IPA, IPS
  rombel: string; // 1, 2, A, B (Bagian belakang kelas)
  angkatan: number; // KUNCI UTAMA menghitung kelas
  foto?: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiswaSchema = new Schema<ISiswa>(
  {
    nama: { type: String, required: true },
    nisn: { type: String, required: true, unique: true },
    tempatLahir: { type: String },
    tanggalLahir: { type: Date },
    jenisKelamin: { type: String, enum: ["L", "P"], required: true },
    agama: { type: String },
    
    // Perhatikan: Field 'kelas' sudah HILANG di sini
    jurusan: { type: String, required: true },
    rombel: { type: String, required: true }, // Wajib
    angkatan: { type: Number, required: true }, // Wajib (Pengganti Kelas)
    
    status: { type: Boolean, default: true },
    foto: { type: String },
  },
  { timestamps: true }
);

// Trik Next.js: Cek apakah model sudah ada agar tidak error compile ulang
const Siswa = mongoose.models.Siswa || mongoose.model<ISiswa>("Siswa", SiswaSchema);
export default Siswa;