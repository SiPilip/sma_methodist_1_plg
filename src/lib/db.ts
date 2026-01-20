import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Harap definisikan MONGODB_URI di dalam file .env.local"
  );
}

// Kita perlu mendefinisikan tipe global agar TypeScript tidak marah
// karena kita menaruh cache koneksi di object 'global'
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Deklarasi global untuk NodeJS
declare global {
  var mongoose: MongooseCache;
}

// Cek apakah sudah ada koneksi yang tersimpan di memori (Cache)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // 1. Jika sudah ada koneksi aktif, langsung pakai (Hemat resource!)
  if (cached.conn) {
    return cached.conn;
  }

  // 2. Jika belum ada janji koneksi (promise), buat baru
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Opsi tambahan bisa ditaruh disini jika perlu
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("✅ Berhasil terhubung ke MongoDB!");
      return mongoose;
    });
  }

  // 3. Tunggu koneksi selesai & simpan ke cache
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Gagal terhubung ke MongoDB:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;