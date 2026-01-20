import mongoose, { Schema, Document } from "mongoose";

export interface IDokumen extends Document {
  name: string;
  category: string;
  description?: string;
  fileUrl: string; // Link ke file asli
  fileType: string; // pdf, docx, dll
  size: number; // Dalam bytes
  downloads: number;
  createdAt: Date;
}

const DokumenSchema = new Schema<IDokumen>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    size: { type: Number },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Dokumen = mongoose.models.Dokumen || mongoose.model<IDokumen>("Dokumen", DokumenSchema);
export default Dokumen;