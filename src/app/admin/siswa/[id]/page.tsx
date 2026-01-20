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
  HiAcademicCap,
  HiTrash,
  HiExclamationTriangle
} from "react-icons/hi2";

// Simulasi Data Dummy (Biasanya dari API/Database)
const MOCK_DATA = {
  id: "1",
  nama: "Alexander Hamilton",
  nisn: "007564200",
  nik: "167101234567890",
  tempatLahir: "Nevis",
  tanggalLahir: "2008-01-11",
  jenisKelamin: "L",
  agama: "Kristen",
  kelas: "XI",
  jurusan: "IPA",
  angkatan: 2024,
  waliKelas: "Oliver Granli",
  status: true, // Aktif
  foto: null // null artinya pakai placeholder, jika ada string url maka pakai gambar itu
};

export default function EditSiswaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State Data Form (Diisi dengan Mock Data)
  const [formData, setFormData] = useState(MOCK_DATA);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Simulasi Fetch Data saat halaman dibuka
  useEffect(() => {
    // Di sini nanti: const data = await fetch(`/api/siswa/${params.id}`)
    console.log("Mengedit siswa dengan ID:", params.id);
  }, [params.id]);

  // Handle Perubahan Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle Submit (Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Data siswa berhasil diperbarui!");
      router.push("/admin/siswa"); 
    }, 1500);
  };

  // Handle Delete (Hapus)
  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus siswa ini secara permanen? Data yang dihapus tidak dapat dikembalikan.")) {
      setIsDeleting(true);
      setTimeout(() => {
        setIsDeleting(false);
        router.push("/admin/siswa");
      }, 1500);
    }
  };

  // Styles Konsisten
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-500 focus:border-blue-950 text-sm transition-all";
  const labelStyle = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/siswa" 
            className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 hover:text-blue-950 transition-colors shadow-sm"
          >
            <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Edit Data Siswa</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Perbarui informasi akademik atau pribadi siswa.
            </p>
          </div>
        </div>

        {/* Tombol Hapus (Danger Zone) */}
        <button 
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors text-sm font-semibold"
        >
          {isDeleting ? "Menghapus..." : <><HiTrash size={18} /> Hapus Siswa</>}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- KOLOM KIRI: FOTO & STATUS --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#DFEBF7] dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
            <h3 className="font-bold text-blue-950 dark:text-white mb-6">Foto Profil Siswa</h3>
            
            {/* Preview Foto */}
            <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg group">
              {imagePreview || formData.foto ? (
                <Image src={imagePreview || (formData?.foto as any)} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full bg-blue-200/50 dark:bg-white/5 text-blue-950/50 dark:text-white/50">
                  <HiPhoto size={64} />
                </div>
              )}
              {/* Overlay Edit */}
              <div className="absolute inset-0 bg-blue-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <HiOutlineCloudArrowUp className="text-white" size={32}/>
              </div>
            </div>

            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2">
              <HiOutlineCloudArrowUp size={18} />
              Ubah Foto
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
            <p className="text-xs text-blue-900/60 dark:text-blue-200/60 mt-3 max-w-[200px]">
              Klik gambar atau tombol untuk mengganti foto siswa.
            </p>
          </div>

          {/* Card Status */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
             <div className="bg-blue-950 px-6 py-3 border-b border-gray-100 dark:border-white/10">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Status Akademik</h3>
             </div>
             <div className="p-6 flex items-center justify-between">
                <div>
                   <p className="font-semibold text-gray-800 dark:text-white">
                     {formData.status ? "Status Aktif" : "Non-Aktif / Cuti"}
                   </p>
                   <p className="text-xs text-gray-500">
                     Geser untuk mengubah status.
                   </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.checked})}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
             </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: FORM EDIT DATA --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. INFORMASI PRIBADI */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden border-l-4 border-l-blue-950">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
               <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-950 dark:text-white">
                  <HiUser size={20} />
               </div>
               <h3 className="font-bold text-lg text-gray-800 dark:text-white">Informasi Pribadi</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelStyle}>Nama Lengkap</label>
                <input 
                  type="text" name="nama" required className={inputStyle} 
                  value={formData.nama} onChange={handleChange} 
                />
              </div>
              <div>
                <label className={labelStyle}>NISN</label>
                <input 
                  type="text" name="nisn" required className={`${inputStyle} font-mono`} 
                  value={formData.nisn} onChange={handleChange} 
                />
              </div>
              <div>
                <label className={labelStyle}>NIK</label>
                <input 
                  type="text" name="nik" className={`${inputStyle} font-mono`} 
                  value={formData.nik} onChange={handleChange} 
                />
              </div>
              <div>
                <label className={labelStyle}>Tempat Lahir</label>
                <input 
                  type="text" name="tempatLahir" className={inputStyle} 
                  value={formData.tempatLahir} onChange={handleChange} 
                />
              </div>
              <div>
                <label className={labelStyle}>Tanggal Lahir</label>
                <input 
                  type="date" name="tanggalLahir" className={inputStyle} 
                  value={formData.tanggalLahir} onChange={handleChange} 
                />
              </div>
              <div>
                <label className={labelStyle}>Jenis Kelamin</label>
                <select name="jenisKelamin" className={inputStyle} value={formData.jenisKelamin} onChange={handleChange}>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Agama</label>
                <select name="agama" className={inputStyle} value={formData.agama} onChange={handleChange}>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Islam">Islam</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. INFORMASI AKADEMIK */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden border-l-4 border-l-blue-600">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
               <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-600 dark:text-white">
                  <HiAcademicCap size={20} />
               </div>
               <h3 className="font-bold text-lg text-gray-800 dark:text-white">Informasi Akademik</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Tingkat Kelas</label>
                <select name="kelas" className={inputStyle} value={formData.kelas} onChange={handleChange}>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Jurusan</label>
                <select name="jurusan" className={inputStyle} value={formData.jurusan} onChange={handleChange}>
                  <option value="IPA">MIPA (Matematika & IPA)</option>
                  <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Angkatan</label>
                <input 
                  type="number" name="angkatan" className={inputStyle} 
                  value={formData.angkatan} onChange={handleChange} 
                />
              </div>
              <div>
                <label className={labelStyle}>Wali Kelas</label>
                <input 
                  type="text" name="waliKelas" className={inputStyle} 
                  value={formData.waliKelas} onChange={handleChange} 
                />
              </div>
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
              {isSubmitting ? "Menyimpan..." : (
                <>
                  <HiCheck size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}