import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("admin_session")?.value;

  // 1. PROTEKSI HALAMAN ADMIN (/admin/*)
  if (path.startsWith("/admin")) {
    // Jika tidak ada token, paksa ke halaman login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. PROTEKSI HALAMAN LOGIN (/login)
  // Jika user sudah login, jangan biarkan masuk halaman login lagi
  if (path === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 3. PROTEKSI API (/api/*)
  // Kecuali API publik seperti: login, logout, seed, dan check kelulusan (publik)
  if (path.startsWith("/api")) {
    const publicApi = [
      "/api/auth/login", 
      "/api/auth/logout", 
      "/api/seed", 
      "/api/kelulusan/check",
      "/api/public/home",   // <--- BARU: Statistik untuk Landing Page
      "/api/berita",       // <--- BARU: Agar publik bisa baca berita
      "/api/public/dokumen",
      "/api/public/dokumen/[id]/download", //        
      "/api/public/guru", //        
      "/api/public/guru/[id]", //        
    ];

    // Khusus API Berita: GET boleh publik, tapi POST/PUT/DELETE wajib login
    if (path.startsWith("/api/berita") && request.method === "GET") {
        return NextResponse.next();
    }

    // Jika bukan API publik DAN tidak ada token
    if (!publicApi.some(p => path.startsWith(p)) && !token) {
       return NextResponse.json(
         { message: "Unauthorized: Silakan login terlebih dahulu." }, 
         { status: 401 }
       );
    }
  }

  return NextResponse.next();
}

// Tentukan path mana saja yang akan dicegat oleh middleware ini
export const config = {
  matcher: [
    "/admin/:path*",  // Semua halaman admin
    "/login",         // Halaman login
    "/api/:path*"     // Semua API
  ],
};