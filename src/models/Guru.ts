import mongoose, { Schema, Document } from "mongoose";

// Sub-schema untuk Pendidikan (agar rapi)
const PendidikanSchema = new Schema(
  {
    jenjang: { type: String, required: true }, // S1, S2, D3
    instansi: { type: String, required: true }, // Universitas Indonesia
    tahun: { type: String, required: true }, // 2015
  },
  { _id: false }
); // Tidak butuh ID khusus untuk sub-dokumen ini

// Sub-schema untuk Media Sosial
const SocialsSchema = new Schema(
  {
    linkedin: { type: String },
    twitter: { type: String },
  },
  { _id: false }
);

export interface IGuru extends Document {
  nama: string;
  nip: string; // Unik
  jabatan: string; // Kepala Sekolah, Guru Matpel, Staff TU
  kategori: "Guru" | "Karyawan";
  mataPelajaran?: string; // Opsional (hanya untuk Guru)
  bio?: string;
  foto?: string;
  pendidikan: {
    jenjang: string;
    instansi: string;
    tahun: string;
  }[];
  socials?: {
    linkedin?: string;
    twitter?: string;
  };
  email?: string;
  noHp?: string;
  status: boolean; // Aktif / Pensiun / Keluar
  createdAt: Date;
  updatedAt: Date;
}

const GuruSchema = new Schema<IGuru>(
  {
    nama: { type: String, required: true },
    nip: { type: String, required: true, unique: true },
    jabatan: { type: String, required: true },
    kategori: { type: String, enum: ["Guru", "Karyawan"], required: true },
    mataPelajaran: { type: String }, // Boleh kosong jika Karyawan
    bio: { type: String },
    foto: { type: String },

    // Array of Objects untuk Riwayat Pendidikan
    pendidikan: [PendidikanSchema],

    // Object untuk Media Sosial
    socials: SocialsSchema,

    email: { type: String },
    noHp: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexing agar pencarian cepat
GuruSchema.index({ nama: "text", nip: "text", jabatan: "text" });

const Guru = mongoose.models.Guru || mongoose.model<IGuru>("Guru", GuruSchema);
export default Guru;