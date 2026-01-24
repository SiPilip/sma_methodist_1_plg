import mongoose, { Schema, Document } from "mongoose";

export interface IDokumen extends Document {
  judul: string;
  deskripsi?: string;
  fileUrl: string;       // Path file: /uploads/dokumen/jadwal.pdf
  kategori: string;      // Akademik, Surat, Formulir
  tipeFile: string;      // pdf, docx, xlsx
  ukuranFile: string;    // "2.5 MB"
  downloadCount: number; // Statistik berapa kali didownload
  createdAt: Date;
  updatedAt: Date;
}

const DokumenSchema = new Schema<IDokumen>(
  {
    judul: { type: String, required: true },
    deskripsi: { type: String },
    fileUrl: { type: String, required: true },
    kategori: { type: String, default: "Umum" },
    tipeFile: { type: String, required: true },
    ukuranFile: { type: String, required: true },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index untuk pencarian cepat
DokumenSchema.index({ judul: "text", deskripsi: "text" });

const Dokumen = mongoose.models.Dokumen || mongoose.model<IDokumen>("Dokumen", DokumenSchema);
export default Dokumen;