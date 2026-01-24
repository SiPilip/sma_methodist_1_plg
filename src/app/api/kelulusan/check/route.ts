import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Kelulusan from "@/models/Kelulusan";
import ConfigKelulusan from "@/models/ConfigKelulusan";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { nisn, tglLahir } = await req.json();

    // 1. Cek Konfigurasi Global (Waktu & Live Status)
    const config = await ConfigKelulusan.findOne();
    
    if (!config) {
        return NextResponse.json({ message: "Sistem belum dikonfigurasi." }, { status: 503 });
    }

    const now = new Date();
    const waktuPengumuman = new Date(config.waktuPengumuman);

    // Cek Apakah Sudah Waktunya?
    if (now < waktuPengumuman) {
        return NextResponse.json({ 
            message: "Pengumuman belum dibuka.", 
            serverTime: now,
            openTime: waktuPengumuman
        }, { status: 403 }); // Forbidden
    }

    // Cek Apakah Live?
    if (!config.isLive) {
        return NextResponse.json({ message: "Akses pengumuman ditutup sementara." }, { status: 503 });
    }

    // 2. Cek Data Siswa (Validasi Ganda)
    // tglLahir harus persis sama stringnya dengan di database (YYYY-MM-DD)
    const data = await Kelulusan.findOne({ 
        nisn: nisn, 
        tglLahir: tglLahir,
        isPublished: true // Hanya data yang sudah diapprove
    });

    if (!data) {
        return NextResponse.json({ 
            message: "Data tidak ditemukan. Periksa NISN dan Tanggal Lahir Anda." 
        }, { status: 404 });
    }

    // 3. Sukses! Kembalikan data penting saja
    return NextResponse.json({ 
        success: true, 
        data: {
            nama: data.nama,
            kelas: data.kelas,
            status: data.status,
            fileSklUrl: data.fileSklUrl,
            catatan: data.catatan,
            nilaiRataRata: data.nilaiRataRata
        }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// GET: Untuk mengambil Waktu Server (Countdown Frontend)
export async function GET() {
    await connectDB();
    const config = await ConfigKelulusan.findOne();
    return NextResponse.json({ 
        serverTime: new Date(), 
        config: config 
    });
}