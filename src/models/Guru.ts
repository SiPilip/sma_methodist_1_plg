import mongoose, { Schema, Document } from "mongoose";

// Sub-document untuk Riwayat Pendidikan
interface IPendidikan {
  institution: string;
  degree: string;
  year: string;
}

export interface IGuru extends Document {
  nama: string;
  nip: string;
  jabatan?: string;
  role: "Guru" | "Karyawan";
  mapel?: string;
  email?: string;
  telepon?: string;
  bio?: string;
  status: boolean;
  foto?: string;
  pendidikan: IPendidikan[]; // Array Pendidikan
  createdAt: Date;
  updatedAt: Date;
}

const GuruSchema = new Schema<IGuru>(
  {
    nama: { type: String, required: true },
    nip: { type: String, required: true, unique: true },
    jabatan: { type: String },
    role: { type: String, enum: ["Guru", "Karyawan"], default: "Guru" },
    mapel: { type: String },
    email: { type: String },
    telepon: { type: String },
    bio: { type: String },
    status: { type: Boolean, default: true },
    foto: { type: String },
    pendidikan: [
      {
        institution: { type: String },
        degree: { type: String },
        year: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Guru = mongoose.models.Guru || mongoose.model<IGuru>("Guru", GuruSchema);
export default Guru;