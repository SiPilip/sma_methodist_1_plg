import mongoose, { Schema, Document } from "mongoose";

export interface IKelulusan extends Document {
  siswaId: mongoose.Types.ObjectId; // Referensi ke data siswa asli
  nama: string;        // Snapshot nama (biar kalau data siswa berubah, ini tetap)
  nisn: string;        // Kunci Login 1
  tglLahir: string;    // Kunci Login 2 (Format YYYY-MM-DD)
  kelas: string;       // XII IPA 1
  status: "Lulus" | "Tidak Lulus" | "Ditunda" | "Pending"; 
  nilaiRataRata?: string; // Opsional
  fileSklUrl?: string;    // URL File Scan SKL (PDF/Image)
  catatan?: string;       // Pesan khusus (misal: "Harap lunasi SPP untuk ambil ijazah")
  isPublished: boolean;   // Approve/Tidak (Siswa ini boleh lihat hasilnya?)
  createdAt: Date;
  updatedAt: Date;
}

const KelulusanSchema = new Schema<IKelulusan>(
  {
    siswaId: { type: Schema.Types.ObjectId, ref: "Siswa", required: true },
    nama: { type: String, required: true },
    nisn: { type: String, required: true, index: true },
    tglLahir: { type: String, required: true }, // Kita simpan string YYYY-MM-DD biar mudah dicocokkan
    kelas: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Lulus", "Tidak Lulus", "Ditunda", "Pending"], 
      default: "Pending" 
    },
    nilaiRataRata: { type: String },
    fileSklUrl: { type: String }, // Path file upload
    catatan: { type: String },
    isPublished: { type: Boolean, default: false }, // Default belum diapprove
  },
  { timestamps: true }
);

// Index komposit untuk login cepat
KelulusanSchema.index({ nisn: 1, tglLahir: 1 });

const Kelulusan = mongoose.models.Kelulusan || mongoose.model<IKelulusan>("Kelulusan", KelulusanSchema);
export default Kelulusan;