"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  HiArrowLeft, 
  HiPhoto, 
  HiCheck, 
  HiOutlineCloudArrowUp,
  HiUser,
  HiBriefcase,
  HiAcademicCap,
  HiTrash,
  HiPlusCircle
} from "react-icons/hi2";

export default function TambahGuruPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State Form
  const [role, setRole] = useState<"Guru" | "Karyawan">("Guru");
  const [educationList, setEducationList] = useState([
    { institution: "", degree: "", year: "" }
  ]);

  // --- LOGIC IMAGE ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- LOGIC DYNAMIC EDUCATION ---
  const addEducation = () => {
    setEducationList([...educationList, { institution: "", degree: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    const newList = [...educationList];
    newList.splice(index, 1);
    setEducationList(newList);
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newList = [...educationList] as any;
    newList[index][field] = value;
    setEducationList(newList);
  };

  // --- SUBMIT ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi Payload
    const payload = {
        role,
        education: educationList,
        // ... field lain
    };
    console.log("Submitting:", payload);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/guru"); 
    }, 1500);
  };

  // Styles
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-500 focus:border-blue-950 text-sm transition-all";
  const labelStyle = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <Link 
          href="/admin/guru" 
          className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 hover:text-blue-950 transition-colors shadow-sm"
        >
          <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Tambah Pegawai Baru</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Daftarkan Guru atau Staff Karyawan ke database.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- KOLOM KIRI: FOTO & PERAN --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upload Foto */}
          <div className="bg-[#DFEBF7] dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
            <h3 className="font-bold text-blue-950 dark:text-white mb-6">Foto Profil</h3>
            <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg group">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full bg-blue-200/50 dark:bg-white/5 text-blue-950/50 dark:text-white/50">
                  <HiUser size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-blue-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <HiOutlineCloudArrowUp className="text-white" size={32}/>
              </div>
            </div>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2">
              <HiOutlineCloudArrowUp size={18} /> Pilih Foto
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {/* Role Switcher */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
             <div className="bg-blue-950 px-6 py-3 border-b border-gray-100 dark:border-white/10">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Peran & Status</h3>
             </div>
             <div className="p-6 space-y-6">
                
                {/* Opsi Guru / Karyawan */}
                <div>
                   <label className={labelStyle}>Tipe Pegawai</label>
                   <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => setRole("Guru")}
                        className={`py-2 text-sm font-bold rounded-md transition-all ${role === "Guru" ? "bg-white shadow-sm text-blue-950" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        GURU
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRole("Karyawan")}
                        className={`py-2 text-sm font-bold rounded-md transition-all ${role === "Karyawan" ? "bg-white shadow-sm text-orange-600" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        KARYAWAN
                      </button>
                   </div>
                   <p className="text-xs text-gray-400 mt-2">
                     *Guru wajib mengisi Mata Pelajaran.
                   </p>
                </div>

                {/* Status Aktif */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Status Aktif</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>
             </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: FORM BIODATA --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. INFORMASI DASAR */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden border-l-4 border-l-blue-950">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
               <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-950 dark:text-white"><HiUser size={20} /></div>
               <h3 className="font-bold text-lg text-gray-800 dark:text-white">Informasi Dasar</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelStyle}>Nama Lengkap (Beserta Gelar)</label>
                <input type="text" required placeholder="Contoh: Oliver Granli, S.Pd., M.M." className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>NIP / NUPTK</label>
                <input type="text" required placeholder="Nomor Induk Pegawai" className={`${inputStyle} font-mono`} />
              </div>
              <div>
                <label className={labelStyle}>Jabatan Struktural</label>
                <input type="text" placeholder="Contoh: Kepala Sekolah / Staff TU" className={inputStyle} />
              </div>
              
              {/* Conditional Field: Mata Pelajaran (Hanya jika Guru) */}
              {role === "Guru" && (
                <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className={labelStyle}>Mata Pelajaran Utama</label>
                  <input type="text" placeholder="Contoh: Matematika Wajib" className={inputStyle} />
                </div>
              )}

              <div>
                <label className={labelStyle}>Email Sekolah</label>
                <input type="email" placeholder="nama@sekolah.sch.id" className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Nomor Telepon / WA</label>
                <input type="tel" placeholder="+62..." className={inputStyle} />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Bio Singkat (Tentang Saya)</label>
                <textarea rows={4} className={inputStyle} placeholder="Ceritakan pengalaman atau motto mengajar..."></textarea>
              </div>
            </div>
          </div>

          {/* 2. RIWAYAT PENDIDIKAN (DYNAMIC FORM) */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden border-l-4 border-l-blue-600">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-600 dark:text-white"><HiAcademicCap size={20} /></div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">Riwayat Pendidikan</h3>
               </div>
               <button 
                type="button" 
                onClick={addEducation}
                className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold transition-colors"
               >
                 <HiPlusCircle size={16} /> Tambah
               </button>
            </div>
            
            <div className="p-6 space-y-4">
              {educationList.map((edu, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex-1">
                     <input 
                      type="text" 
                      placeholder="Nama Kampus / Universitas" 
                      className={inputStyle}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                     />
                  </div>
                  <div className="w-full md:w-1/3">
                     <input 
                      type="text" 
                      placeholder="Gelar (S1/S2)" 
                      className={inputStyle}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                     />
                  </div>
                  <div className="w-full md:w-24">
                     <input 
                      type="number" 
                      placeholder="Tahun" 
                      className={inputStyle}
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                     />
                  </div>
                  
                  {/* Tombol Hapus Baris */}
                  {educationList.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEducation(index)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus baris ini"
                    >
                      <HiTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-xs text-gray-400 italic">
                *Urutkan dari pendidikan terakhir.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? "Menyimpan..." : <><HiCheck size={20} /> Simpan Data Pegawai</>}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}