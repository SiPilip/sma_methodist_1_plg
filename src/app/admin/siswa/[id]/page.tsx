"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  HiArrowLeft, HiPhoto, HiOutlineCloudArrowUp,
  HiUser, HiAcademicCap, HiTrash
} from "react-icons/hi2";

// Import Component Cropper
import ImageCropperModal from "@/components/ImageCropperModal";

const fetchSiswaById = async (id: string) => {
  const res = await fetch(`/api/siswa/${id}`);
  if (!res.ok) throw new Error("Gagal mengambil data siswa");
  const json = await res.json();
  return json.data;
};

export default function EditSiswaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // State Data & File
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [kelasSaatIni, setKelasSaatIni] = useState("10"); 

  // State Cropper
  const [showCropper, setShowCropper] = useState(false);
  const [tempImgSrc, setTempImgSrc] = useState<string | null>(null);

  const { data: siswa, isLoading, isError } = useQuery({
    queryKey: ["siswa", id],
    queryFn: () => fetchSiswaById(id),
    retry: false, // JANGAN RETRY
  });

  // --- LOGIC KELAS & ANGKATAN ---
  const getKelasValueFromAngkatan = (angkatan: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const schoolYearStart = currentMonth >= 7 ? currentYear : currentYear - 1;
    const grade = 10 + (schoolYearStart - angkatan);
    if (grade >= 10 && grade <= 12) return String(grade);
    return "10"; 
  };

  const calculateAngkatan = (kelasPilihan: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const schoolYearStart = currentMonth >= 7 ? currentYear : currentYear - 1;
    const diff = kelasPilihan - 10; 
    return schoolYearStart - diff;
  };

  useEffect(() => {
    if (siswa) {
      if (siswa.foto) setImagePreview(siswa.foto);
      if (siswa.angkatan) setKelasSaatIni(getKelasValueFromAngkatan(siswa.angkatan));
    }
  }, [siswa]);

  // --- LOGIC IMAGE UPLOAD & CROP ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit awal 5MB
        toast.error("Ukuran file terlalu besar (Max 5MB).");
        return;
      }
      
      // Baca file ke URL sementara untuk Cropper
      const reader = new FileReader();
      reader.onload = () => {
          setTempImgSrc(reader.result as string);
          setShowCropper(true); // Buka Modal Crop
      };
      reader.readAsDataURL(file);
      e.target.value = ""; // Reset input
    }
  };

  const onCropComplete = (croppedFile: File) => {
    // 1. Simpan File Hasil Crop untuk dikirim ke API
    setSelectedFile(croppedFile);

    // 2. Buat Preview
    const objectUrl = URL.createObjectURL(croppedFile);
    setImagePreview(objectUrl);

    // 3. Tutup Modal
    setShowCropper(false);
    setTempImgSrc(null);
  };

  // --- MUTATION UPDATE ---
  const updateMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await fetch(`/api/siswa/${id}`, {
        method: "PUT",
        body: payload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal update");
      return data;
    },
    onSuccess: () => {
      toast.success("Data siswa berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["siswa"] });
      router.push("/admin/siswa");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const kelasInput = Number(formData.get("kelas_saat_ini"));
    const angkatanOtomatis = calculateAngkatan(kelasInput);

    const payload = new FormData();
    payload.append("nama", formData.get("nama") as string);
    payload.append("nisn", formData.get("nisn") as string);
    payload.append("tempatLahir", formData.get("tempatLahir") as string);
    payload.append("tanggalLahir", formData.get("tanggalLahir") as string);
    payload.append("jenisKelamin", formData.get("jenisKelamin") as string);
    payload.append("agama", formData.get("agama") as string);
    payload.append("jurusan", formData.get("jurusan") as string);
    payload.append("rombel", formData.get("rombel") as string);
    payload.append("angkatan", String(angkatanOtomatis));
    payload.append("status", String(formData.get("status") === "on"));

    // Kirim File Baru (Hanya jika user mengganti foto)
    if (selectedFile) {
      payload.append("foto", selectedFile);
    }

    updateMutation.mutate(payload);
  };

  // --- DELETE LOGIC ---
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/siswa/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Siswa dihapus permanen.");
      queryClient.invalidateQueries({ queryKey: ["siswa"] });
      router.push("/admin/siswa");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleDelete = () => {
    if (confirm("⚠️ Yakin hapus siswa ini? Foto & Data akan hilang permanen.")) {
      deleteMutation.mutate();
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-red-100 p-6 rounded-full">
           <HiAcademicCap className="text-red-500 text-6xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Data Siswa Tidak Ditemukan</h2>
        <p className="text-gray-500 max-w-md">
          Halaman yang Anda cari mungkin telah dihapus atau URL yang Anda masukkan salah.
        </p>
        <Link 
          href="/admin/siswa" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all"
        >
          Kembali ke Daftar Siswa
        </Link>
      </div>
    );
  }

  if (isLoading) return <div className="p-10 text-center animate-pulse">Memuat data...</div>;

  return (
    <div className="space-y-8 pb-10">
      
      {/* CROPPER MODAL */}
      {showCropper && tempImgSrc && (
        <ImageCropperModal 
            imageSrc={tempImgSrc}
            onCancel={() => { setShowCropper(false); setTempImgSrc(null); }}
            onCropComplete={onCropComplete}
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/siswa" className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-colors shadow-sm">
            <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Edit Data Siswa</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update data & rombel.</p>
          </div>
        </div>
        <button onClick={handleDelete} disabled={deleteMutation.isPending} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors text-sm font-semibold">
          {deleteMutation.isPending ? "Menghapus..." : <><HiTrash size={18} /> Hapus Siswa</>}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: FOTO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#DFEBF7] dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
            <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg bg-white group">
              {imagePreview ? (
                 imagePreview.startsWith("data:") || imagePreview.startsWith("blob:") ? 
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> :
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-blue-200"><HiPhoto size={64} /></div>
              )}
              <div className="absolute inset-0 bg-blue-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <HiOutlineCloudArrowUp className="text-white" size={32}/>
              </div>
            </div>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2">
              <HiOutlineCloudArrowUp size={18} /> Ganti Foto
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
            <p className="text-xs text-blue-900/60 mt-3">Upload baru akan menghapus foto lama.</p>
          </div>

          <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
             <div><p className="font-semibold text-gray-800 dark:text-white">Status Aktif</p></div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" name="status" defaultChecked={siswa.status} className="sr-only peer" />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
             </label>
          </div>
        </div>

        {/* KOLOM KANAN: FORM */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 border-b pb-4 mb-2"><h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><HiUser /> Informasi Pribadi</h3></div>
              
              <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label><input type="text" name="nama" defaultValue={siswa.nama} required className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">NISN</label><input type="text" name="nisn" defaultValue={siswa.nisn} required className="w-full px-4 py-2 border rounded-lg font-mono" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tempat Lahir</label><input type="text" name="tempatLahir" defaultValue={siswa.tempatLahir} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Lahir</label><input type="date" name="tanggalLahir" defaultValue={siswa.tanggalLahir ? new Date(siswa.tanggalLahir).toISOString().split('T')[0] : ''} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jenis Kelamin</label><select name="jenisKelamin" defaultValue={siswa.jenisKelamin} className="w-full px-4 py-2 border rounded-lg"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Agama</label><select name="agama" defaultValue={siswa.agama} className="w-full px-4 py-2 border rounded-lg"><option value="Kristen">Kristen</option><option value="Katolik">Katolik</option><option value="Islam">Islam</option><option value="Buddha">Buddha</option><option value="Hindu">Hindu</option><option value="Konghucu">Konghucu</option></select></div>

              <div className="md:col-span-2 border-b pb-4 mb-2 mt-4"><h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><HiAcademicCap /> Informasi Akademik</h3></div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kelas Saat Ini</label>
                <select 
                  name="kelas_saat_ini" 
                  value={kelasSaatIni} 
                  onChange={(e) => setKelasSaatIni(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-blue-50 text-blue-900 font-bold"
                >
                  <option value="10">Kelas 10 (X)</option>
                  <option value="11">Kelas 11 (XI)</option>
                  <option value="12">Kelas 12 (XII)</option>
                </select>
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jurusan</label>
                 <select name="jurusan" defaultValue={siswa.jurusan} className="w-full px-4 py-2 border rounded-lg"><option value="MIPA">MIPA</option><option value="IPS">IPS</option></select>
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rombel (Grup)</label>
                 <input type="text" name="rombel" defaultValue={siswa.rombel} className="w-full px-4 py-2 border rounded-lg" placeholder="1, 2, A, B..." />
              </div>
          </div>

          <div className="flex justify-end gap-4">
             <button type="button" onClick={() => router.back()} className="px-6 py-3 border rounded-lg hover:bg-gray-50">Batal</button>
             <button type="submit" disabled={updateMutation.isPending} className="px-8 py-3 bg-blue-950 text-white font-bold rounded-lg hover:bg-blue-900 shadow-lg disabled:opacity-70">
                {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}