import mongoose, { Schema, Document } from "mongoose";

// 1. Definisikan Tipe Data (Interface) untuk TypeScript
export interface ISiswa extends Document {
  nama: string;
  nisn: string;
  nik?: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  jenisKelamin: "L" | "P";
  agama?: string;
  kelas: string; // X, XI, XII
  jurusan: string; // IPA, IPS
  angkatan: number;
  waliKelas?: string;
  status: boolean; // true = Aktif, false = Non-Aktif
  foto?: string; // URL Foto
  createdAt: Date;
  updatedAt: Date;
}

// 2. Buat Schema Mongoose
const SiswaSchema = new Schema<ISiswa>(
  {
    nama: { type: String, required: true },
    nisn: { type: String, required: true, unique: true }, // NISN tidak boleh kembar
    nik: { type: String },
    tempatLahir: { type: String },
    tanggalLahir: { type: Date },
    jenisKelamin: { type: String, enum: ["L", "P"], required: true },
    agama: { type: String },
    kelas: { type: String, required: true },
    jurusan: { type: String, required: true },
    angkatan: { type: Number, required: true },
    waliKelas: { type: String },
    status: { type: Boolean, default: true },
    foto: { type: String },
  },
  {
    timestamps: true, // Otomatis buat field createdAt & updatedAt
  }
);

// 3. Export Model (Cek dulu apakah model sudah ada agar tidak error saat hot-reload Next.js)
const Siswa = mongoose.models.Siswa || mongoose.model<ISiswa>("Siswa", SiswaSchema);
export default Siswa;