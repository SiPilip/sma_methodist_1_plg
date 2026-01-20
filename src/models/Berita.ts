import mongoose, { Schema, Document } from "mongoose";

export interface IBerita extends Document {
  judul: string;
  slug: string;        // URL friendly: "juara-satu-lomba"
  konten: string;      // HTML String dari Rich Text Editor
  thumbnail?: string;  // URL Gambar
  kategori: string;    // "Berita", "Artikel", "Pengumuman"
  penulis: string;     // Nama Admin / Guru
  status: "Draft" | "Published";
  views: number;       // Jumlah pembaca
  createdAt: Date;
  updatedAt: Date;
}

const BeritaSchema = new Schema<IBerita>(
  {
    judul: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    konten: { type: String, required: true },
    thumbnail: { type: String },
    kategori: { type: String, default: "Berita" },
    penulis: { type: String, default: "Admin" }, // Nanti bisa ambil dari session
    status: { 
      type: String, 
      enum: ["Draft", "Published"], 
      default: "Published" 
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexing untuk pencarian cepat
BeritaSchema.index({ judul: "text", konten: "text" });

const Berita = mongoose.models.Berita || mongoose.model<IBerita>("Berita", BeritaSchema);
export default Berita;