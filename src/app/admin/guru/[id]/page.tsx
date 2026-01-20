"use client";

import { useState, useEffect } from "react";
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

// MOCK DATA (Simulasi Data dari Database)
const MOCK_DATA = {
  id: "G-001",
  nama: "Oliver Granli, S.Pd., M.M.",
  nip: "19850101 201001 1 001",
  jabatan: "Kepala Sekolah",
  role: "Guru" as "Guru" | "Karyawan",
  mapel: "Matematika Lanjut",
  email: "oliver.granli@sekolah.sch.id",
  telepon: "+62 812 3456 7890",
  bio: "Berpengalaman 15 tahun di bidang manajemen pendidikan.",
  status: true, // Aktif
  foto: null, // null = pakai placeholder
  pendidikan: [
    { institution: "Universitas Indonesia", degree: "S2 Manajemen", year: "2015" },
    { institution: "UNJ", degree: "S1 Pendidikan Matematika", year: "2010" }
  ]
};

export default function EditGuruPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State Form (Diisi Mock Data)
  const [formData, setFormData] = useState(MOCK_DATA);
  const [educationList, setEducationList] = useState(MOCK_DATA.pendidikan);

  // Simulasi Fetch Data
  useEffect(() => {
    console.log("Fetching data guru ID:", params.id);
    // Nanti: setFormData(fetchedData);
  }, [params.id]);

  // --- LOGIC IMAGE ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- LOGIC INPUT ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // --- ACTIONS ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Payload Update
    const payload = { ...formData, pendidikan: educationList };
    console.log("Updating:", payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Data pegawai berhasil diperbarui!");
      router.push("/admin/guru"); 
    }, 1500);
  };

  const handleDelete = () => {
    if (confirm("Yakin ingin menghapus pegawai ini? Tindakan ini tidak dapat dibatalkan.")) {
      setIsDeleting(true);
      setTimeout(() => {
        setIsDeleting(false);
        router.push("/admin/guru");
      }, 1500);
    }
  };

  // Styles
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-500 focus:border-blue-950 text-sm transition-all";
  const labelStyle = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/guru" 
            className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 hover:text-blue-950 transition-colors shadow-sm"
          >
            <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Edit Data Pegawai</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Perbarui profil, jabatan, atau riwayat pendidikan.
            </p>
          </div>
        </div>

        {/* Tombol Hapus */}
        <button 
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors text-sm font-semibold"
        >
          {isDeleting ? "Menghapus..." : <><HiTrash size={18} /> Hapus Pegawai</>}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- KOLOM KIRI: FOTO & STATUS --- */}
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
              {/* Overlay Edit */}
              <div className="absolute inset-0 bg-blue-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <HiOutlineCloudArrowUp className="text-white" size={32}/>
              </div>
            </div>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2">
              <HiOutlineCloudArrowUp size={18} /> Ubah Foto
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {/* Role & Status Switcher */}
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
                        onClick={() => setFormData({...formData, role: "Guru"})}
                        className={`py-2 text-sm font-bold rounded-md transition-all ${formData.role === "Guru" ? "bg-white shadow-sm text-blue-950" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        GURU
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, role: "Karyawan"})}
                        className={`py-2 text-sm font-bold rounded-md transition-all ${formData.role === "Karyawan" ? "bg-white shadow-sm text-orange-600" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        KARYAWAN
                      </button>
                   </div>
                </div>

                {/* Status Aktif */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Status Aktif</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.checked})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                </div>
             </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: FORM DATA --- */}
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
                <input 
                    type="text" name="nama" required className={inputStyle} 
                    value={formData.nama} onChange={handleChange}
                />
              </div>
              <div>
                <label className={labelStyle}>NIP / NUPTK</label>
                <input 
                    type="text" name="nip" required className={`${inputStyle} font-mono`} 
                    value={formData.nip} onChange={handleChange}
                />
              </div>
              <div>
                <label className={labelStyle}>Jabatan Struktural</label>
                <input 
                    type="text" name="jabatan" className={inputStyle} 
                    value={formData.jabatan} onChange={handleChange}
                />
              </div>
              
              {/* Conditional Field: Mapel */}
              {formData.role === "Guru" && (
                <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className={labelStyle}>Mata Pelajaran Utama</label>
                  <input 
                    type="text" name="mapel" className={inputStyle} 
                    value={formData.mapel} onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <label className={labelStyle}>Email Sekolah</label>
                <input 
                    type="email" name="email" className={inputStyle} 
                    value={formData.email} onChange={handleChange}
                />
              </div>
              <div>
                <label className={labelStyle}>Nomor Telepon / WA</label>
                <input 
                    type="tel" name="telepon" className={inputStyle} 
                    value={formData.telepon} onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle}>Bio Singkat</label>
                <textarea 
                    name="bio" rows={4} className={inputStyle} 
                    value={formData.bio} onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* 2. RIWAYAT PENDIDIKAN (DYNAMIC) */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden border-l-4 border-l-blue-600">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-600 dark:text-white"><HiAcademicCap size={20} /></div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">Riwayat Pendidikan</h3>
               </div>
               <button 
                type="button" onClick={addEducation}
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
                      type="text" placeholder="Nama Kampus / Universitas" className={inputStyle}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                     />
                  </div>
                  <div className="w-full md:w-1/3">
                     <input 
                      type="text" placeholder="Gelar (S1/S2)" className={inputStyle}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                     />
                  </div>
                  <div className="w-full md:w-24">
                     <input 
                      type="number" placeholder="Tahun" className={inputStyle}
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                     />
                  </div>
                  {/* Hapus Baris */}
                  {educationList.length > 1 && (
                    <button 
                      type="button" onClick={() => removeEducation(index)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus baris ini"
                    >
                      <HiTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
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
              {isSubmitting ? "Menyimpan..." : <><HiCheck size={20} /> Simpan Perubahan</>}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}