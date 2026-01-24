"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HiLockClosed, HiUser, HiAcademicCap, HiOutlineArrowRight } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";
import BgHero from "@/../public/img/bg-hero-page.png";


export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  // Efek mount untuk animasi halus saat halaman dimuat
  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validasi sederhana
    if (!formData.username || !formData.password) {
       toast.error("Username dan Password wajib diisi");
       setLoading(false);
       return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal login. Periksa username/password.");
      }

      toast.success("Login Berhasil! Mengalihkan...", { duration: 2000 });
      
      // Beri jeda sedikit untuk transisi
      setTimeout(() => {
        router.refresh(); 
        router.push("/admin");
      }, 1000);

    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Mencegah flash konten sebelum mount
  if (!mounted) return null;

  return (
    // Container Utama: Grid 2 Kolom pada layar besar (lg), 1 kolom di mobile
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-gray-900 overflow-hidden">
      <Toaster position="top-center" toastOptions={{ className: 'font-medium', style: { borderRadius: '12px' } }} />
      
      {/* --- KOLOM KIRI: BRANDING SEKOLAH (Hanya muncul di Desktop) --- */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-16 text-white h-full overflow-hidden animate-in slide-in-from-left duration-700">
        
        {/* Background Image & Gradient Overlay */}
        {/* GANTI 'src' DI BAWAH DENGAN FOTO SEKOLAH ANDA NANTI */}
        <div className="absolute inset-0 z-0">
            <Image 
               src={BgHero} 
               alt="Gedung Sekolah" 
               fill 
               className="object-cover scale-105 transition-transform duration-[20s] hover:scale-110"
               priority
            />
            {/* Gradient biru tua agar teks terbaca jelas dan terasa premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-950/95 mix-blend-multiply"></div>
        </div>

        {/* Konten Branding di atas Overlay */}
        <div className="relative z-10 text-center max-w-lg space-y-8 p-8 backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
            {/* Logo */}
            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center border border-white/20 shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <HiAcademicCap size={60} className="text-blue-100" />
            </div>
            
            {/* Title & Subtitle */}
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                   SMA Methodist 1 Palembang
                </h1>
                <div className="h-1 w-24 bg-blue-400/50 mx-auto rounded-full"></div>
                <p className="text-blue-100/90 text-lg leading-relaxed font-medium">
                   Sistem Informasi Manajemen Sekolah Terpadu. <br/> Melayani dengan Kasih dan Disiplin.
                </p>
            </div>
        </div>

        {/* Copyright di Kiri Bawah */}
        <div className="absolute bottom-8 text-blue-200/60 text-sm z-10">
           &copy; {new Date().getFullYear()} SMA Methodist 1 Palembang. Built for excellence. Made with love by @philifsss_
        </div>
      </div>

      {/* --- KOLOM KANAN: FORM LOGIN (Pusat Perhatian) --- */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-gray-50 dark:bg-gray-900 animate-in slide-in-from-right duration-700 delay-100">
         <div className="w-full max-w-lg space-y-10 bg-white dark:bg-gray-800 p-10 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
            
            {/* Hiasan corner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            {/* Header Form */}
            <div className="space-y-3 relative">
               {/* Logo kecil untuk Mobile Only */}
               <div className="lg:hidden flex items-center gap-3 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                   <div className="p-2 bg-blue-600 rounded-lg text-white"><HiAcademicCap size={24}/></div>
                   <span className="font-bold text-blue-900 dark:text-blue-100">SMA Methodist 1</span>
               </div>

               <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Selamat Datang! 👋</h2>
               <p className="text-gray-500 dark:text-gray-400 text-lg">Silakan masuk untuk mengakses panel admin.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 relative">
               
               <div className="space-y-6">
                  {/* Input Username */}
                  <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Username / NIP</label>
                     <div className="relative group">
                        <HiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600" size={20} />
                        <input 
                          type="text" 
                          className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 outline-none focus:ring-0 focus:border-blue-600 dark:focus:border-blue-500 transition-all font-medium text-gray-800 dark:text-white placeholder-gray-400"
                          placeholder="Masukkan username Anda..."
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                     </div>
                  </div>

                  {/* Input Password */}
                  <div>
                     <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                        {/* Link Lupa Password (Dummy dulu) */}
                        <Link href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                           Lupa password?
                        </Link>
                     </div>
                     <div className="relative group">
                        <HiLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600" size={20} />
                        <input 
                          type="password" 
                          className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 outline-none focus:ring-0 focus:border-blue-600 dark:focus:border-blue-500 transition-all font-medium font-mono text-gray-800 dark:text-white placeholder-gray-400"
                          placeholder="••••••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               {/* Tombol Login */}
               <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-blue-600/30 transition-all active:scale-[0.98] flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
               >
                  {/* Efek kilau saat hover */}
                  <div className="absolute inset-0 w-full h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_ease-in-out]"></div>

                  {loading ? (
                    <>
                     <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"/>
                     <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                     <span>Masuk ke Dashboard</span>
                     <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform"/>
                    </>
                  )}
               </button>

            </form>
            
            {/* Footer Mobile */}
            <div className="lg:hidden mt-8 text-center text-sm text-gray-400">
               &copy; {new Date().getFullYear()} SMA Methodist 1 Plg.
            </div>
         </div>
      </div>
    </div>
  );
}