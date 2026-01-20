"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  HiEye, 
  HiEyeSlash, 
  HiEnvelope, 
  HiLockClosed,
  HiArrowRight
} from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulasi Login
    setTimeout(() => {
      if (email === "admin@sekolah.sch.id" && password === "admin123") {
        router.push("/admin");
      } else {
        setError("Akun tidak ditemukan. Cek email & password Anda.");
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#0f172a]">
      
      {/* --- BAGIAN KIRI: GAMBAR & QUOTE (Hidden di Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden">
        {/* Gambar Background */}
        <div className="absolute inset-0">
          <Image
            src="/img/tentang-kami.png" // Menggunakan gambar yang sudah ada
            alt="Gedung Sekolah"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent"></div>
        </div>

        {/* Konten Text di atas Gambar */}
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full max-w-2xl">
          <div className="mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-6 border border-white/30">
               {/* Logo Placeholder */}
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Membangun Generasi <br/> Cerdas & Berkarakter.
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed opacity-90">
              {"Pendidikan bukan persiapan untuk hidup. Pendidikan adalah hidup itu sendiri."}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="h-1.5 w-8 bg-white rounded-full"></div>
            <div className="h-1.5 w-2 bg-white/30 rounded-full"></div>
            <div className="h-1.5 w-2 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50 dark:bg-[#1a202c]">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Mobile Only (Logo) */}
          <div className="lg:hidden text-center mb-8">
             <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
             </div>
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SMA Methodist 1</h2>
          </div>

          {/* Heading Form */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Selamat Datang! 👋</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Silakan masuk untuk mengakses panel administrator.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-medium flex items-center gap-2 animate-pulse">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Sekolah</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <HiEnvelope size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@sekolah.sch.id"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm shadow-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                 <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500">Lupa password?</a>
                 </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <HiLockClosed size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all sm:text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  >
                    {showPassword ? <HiEyeSlash size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <CgSpinner className="animate-spin text-xl" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk Dashboard
                  <HiArrowRight size={16} className="text-blue-200" />
                </>
              )}
            </button>
          </form>

          {/* Footer Kecil */}
          <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
            &copy; 2026 SMA Methodist 1 Palembang. Protected by ReCaptcha.
          </p>
        </div>
      </div>
    </div>
  );
}