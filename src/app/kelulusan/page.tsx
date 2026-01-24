"use client";

import { useState, useEffect } from "react";
import { HiLockClosed, HiAcademicCap, HiDocumentCheck, HiArrowPath, HiInformationCircle } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";

// Komponen Helper: Countdown
const Countdown = ({ targetDate, onComplete }: { targetDate: string, onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        onComplete(); 
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return <div className="animate-pulse text-white">Menghitung waktu...</div>;

  return (
    <div className="grid grid-cols-4 gap-4 text-center text-white">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
          <div className="text-3xl md:text-5xl font-bold font-mono">{value}</div>
          <div className="text-xs uppercase mt-1 opacity-80">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default function PengumumanPage() {
  // State Utama
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  
  // Logic State
  const [isOpened, setIsOpened] = useState(false);       // Sudah waktunya & Live ON
  const [isSystemClosed, setIsSystemClosed] = useState(false); // Sudah waktunya TAPI Live OFF (Target Request Anda)
  
  // Form State
  const [nisn, setNisn] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 1. Fetch Config saat Load
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/kelulusan/check"); 
        const json = await res.json();
        
        if (json.config) {
            setConfig(json.config);
            const now = new Date(json.serverTime).getTime();
            const openTime = new Date(json.config.waktuPengumuman).getTime();
            
            // LOGIKA PENENTUAN TAMPILAN
            if (now < openTime) {
                // Kasus 1: Belum Waktunya -> Countdown
                setIsOpened(false);
                setIsSystemClosed(false);
            } else {
                // Kasus 2: Sudah Waktunya
                if (json.config.isLive) {
                    // Jika Admin ON -> Buka Form
                    setIsOpened(true);
                    setIsSystemClosed(false);
                } else {
                    // Jika Admin OFF -> Tampilkan Pesan "Belum Ada Pengumuman" (REQUEST ANDA)
                    setIsOpened(false);
                    setIsSystemClosed(true);
                }
            }
        }
      } catch (e) {
        console.error("Gagal koneksi ke server");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // 2. Handle Cek Kelulusan
  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!nisn || !tglLahir) return toast.error("Data harus lengkap!");

    setIsChecking(true);
    setResult(null); 

    try {
      const res = await fetch("/api/kelulusan/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nisn, tglLahir }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Gagal memproses data");
      }

      setResult(json.data);
      toast.success("Data ditemukan!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsChecking(false);
    }
  };

  // --- RENDER ---
  if (isLoading) {
      return <div className="min-h-screen bg-blue-950 flex items-center justify-center text-white">Memuat Sistem...</div>;
  }

  if (!config) {
      return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">Sistem Pengumuman Belum Siap.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center"/>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[100px]"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-3xl z-10">
        
        {/* Header Logo */}
        <div className="text-center mb-10 space-y-2">
            <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-full mx-auto flex items-center justify-center border border-white/20 shadow-xl mb-4">
                <HiAcademicCap className="text-4xl text-white"/>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Pengumuman Kelulusan</h1>
            <p className="text-blue-200">SMA Methodist 1 Palembang - TA {config.tahunAjaran}</p>
        </div>

        {/* --- STATE 1: COUNTDOWN (BELUM WAKTUNYA) --- */}
        {!isOpened && !isSystemClosed && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
             <HiLockClosed className="text-5xl text-yellow-400 mx-auto mb-6"/>
             <h2 className="text-2xl font-bold text-white mb-2">Pengumuman Segera Dibuka</h2>
             <p className="text-blue-200 mb-8">Silakan tunggu hingga waktu hitung mundur selesai.</p>
             
             <Countdown 
                targetDate={config.waktuPengumuman} 
                onComplete={() => window.location.reload()} 
             />
          </div>
        )}

        {/* --- STATE 2: SYSTEM CLOSED (SUDAH LEWAT TAPI ADMIN OFF) --- */}
        {/* Ini yang Anda minta */}
        {isSystemClosed && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl animate-in zoom-in duration-300">
             <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiInformationCircle className="text-5xl text-blue-300"/>
             </div>
             <h2 className="text-2xl font-bold text-white mb-4">Informasi Sistem</h2>
             <p className="text-lg text-blue-100 leading-relaxed max-w-lg mx-auto">
                Anda berada di sistem pengumuman kelulusan SMA Methodist 1 Palembang.
                <br/><br/>
                <span className="font-bold bg-white/10 px-4 py-2 rounded-lg">Saat ini belum ada pengumuman kelulusan.</span>
             </p>
             <p className="text-sm text-blue-300/60 mt-8">Silakan cek kembali secara berkala.</p>
          </div>
        )}

        {/* --- STATE 3: FORM INPUT (OPENED) --- */}
        {isOpened && !result && (
           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="bg-gray-50 p-6 border-b text-center">
                 <p className="text-gray-600 text-sm">Masukkan identitas Anda untuk melihat hasil.</p>
              </div>
              <form onSubmit={handleCheck} className="p-8 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Induk Siswa Nasional (NISN)</label>
                    <input 
                      type="text" 
                      required
                      value={nisn}
                      onChange={(e) => setNisn(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none font-mono text-lg"
                      placeholder="Contoh: 0051234567"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Lahir</label>
                    <input 
                      type="date" 
                      required
                      value={tglLahir}
                      onChange={(e) => setTglLahir(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                    />
                 </div>
                 <button 
                    type="submit" 
                    disabled={isChecking}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
                 >
                    {isChecking ? "Memeriksa Data..." : "Cek Kelulusan Saya"}
                 </button>
              </form>
           </div>
        )}

        {/* --- STATE 4: HASIL (RESULT) --- */}
        {isOpened && result && (
           <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative">
              <div className={`p-8 text-center text-white ${
                 result.status === 'Lulus' ? 'bg-gradient-to-b from-green-500 to-green-600' :
                 result.status === 'Ditunda' ? 'bg-gradient-to-b from-orange-500 to-orange-600' :
                 'bg-gradient-to-b from-red-500 to-red-600'
              }`}>
                 <h2 className="text-3xl font-bold mb-2">HALO, {result.nama.toUpperCase()}</h2>
                 <p className="opacity-90">{result.kelas}</p>
                 
                 <div className="mt-8 mb-4">
                    <span className="text-sm uppercase tracking-widest opacity-80">STATUS KELULUSAN ANDA</span>
                    <div className="text-5xl md:text-7xl font-black mt-2 tracking-tight drop-shadow-md">
                       {result.status.toUpperCase()}
                    </div>
                 </div>
              </div>

              <div className="p-8 space-y-6">
                 {result.status === 'Lulus' && result.fileSklUrl && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                       <h3 className="font-bold text-green-800 mb-2">Surat Keterangan Lulus (SKL)</h3>
                       <p className="text-sm text-green-600 mb-4">Dokumen resmi sekolah dapat diunduh di bawah ini.</p>
                       <a 
                         href={result.fileSklUrl} 
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/30 transition-all"
                       >
                          <HiDocumentCheck size={20}/> Download SKL (PDF)
                       </a>
                    </div>
                 )}

                 {result.catatan && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                       <strong>Catatan Sekolah:</strong> {result.catatan}
                    </div>
                 )}

                 <button 
                    onClick={() => { setResult(null); setNisn(""); setTglLahir(""); }}
                    className="w-full py-3 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
                 >
                    <HiArrowPath/> Cek Siswa Lain
                 </button>
              </div>
           </div>
        )}

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-center text-white/30 text-xs">
         &copy; {new Date().getFullYear()} SMA Methodist 1 Palembang. All Rights Reserved.
      </div>
    </div>
  );
}