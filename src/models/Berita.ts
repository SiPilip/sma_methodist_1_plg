import mongoose, { Schema, Document } from "mongoose";

export interface IBerita extends Document {
  title: string;
  slug: string; // URL ramah SEO
  category: string;
  author: string;
  content: string; // HTML dari Rich Text Editor
  coverImage?: string;
  status: "Published" | "Draft" | "Archived";
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BeritaSchema = new Schema<IBerita>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // Nanti kita generate otomatis
    category: { type: String, required: true },
    author: { type: String, default: "Admin" },
    content: { type: String, required: true },
    coverImage: { type: String },
    status: {
      type: String,
      enum: ["Published", "Draft", "Archived"],
      default: "Draft",
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Berita = mongoose.models.Berita || mongoose.model<IBerita>("Berita", BeritaSchema);
export default Berita;