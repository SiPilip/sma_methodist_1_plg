import mongoose, { Schema, Document } from "mongoose";

export interface IConfigKelulusan extends Document {
  tahunAjaran: string;      // 2025/2026
  waktuPengumuman: Date;    // Kapan pintu dibuka?
  isLive: boolean;          // Saklar darurat (ON/OFF)
  infoKontak: string;       // Teks bantuan jika ada masalah
}

const ConfigKelulusanSchema = new Schema<IConfigKelulusan>(
  {
    tahunAjaran: { type: String, default: "2025/2026" },
    waktuPengumuman: { type: Date, default: new Date() },
    isLive: { type: Boolean, default: false },
    infoKontak: { type: String, default: "Hubungi Tata Usaha jika data bermasalah." }
  },
  { timestamps: true }
);

const ConfigKelulusan = mongoose.models.ConfigKelulusan || mongoose.model<IConfigKelulusan>("ConfigKelulusan", ConfigKelulusanSchema);
export default ConfigKelulusan;