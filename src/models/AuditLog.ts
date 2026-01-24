import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId; // Siapa pelakunya?
  namaUser: string;                // Nama pelakunya (snapshot)
  action: string;                  // CREATE / UPDATE / DELETE / LOGIN
  target: string;                  // Siswa / Guru / Berita
  details: string;                 // "Menghapus siswa Budi"
  ipAddress?: string;              // IP Address pelakunya
  userAgent?: string;              // Browser apa?
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    namaUser: { type: String, required: true },
    action: { type: String, required: true },
    target: { type: String, required: true },
    details: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true } // Otomatis mencatat waktu kejadian
);

// Expire data otomatis setelah 1 tahun (opsional, biar database gak penuh)
// AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
export default AuditLog;