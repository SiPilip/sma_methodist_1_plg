"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  HiArrowLeft, HiPhoto, HiOutlineCloudArrowUp, HiCheck,
  HiBriefcase, HiAcademicCap, HiTrash, HiPlus,
  HiUser, HiEnvelope, HiPhone
} from "react-icons/hi2";
import ImageCropperModal from "@/components/ImageCropperModal"; 

// Tipe Data
type PendidikanState = {
  jenjang: string;
  instansi: string;
  tahun: string;
};

// Fetcher
const fetchGuruById = async (id: string) => {
  const res = await fetch(`/api/guru/${id}`);
  if (!res.ok) throw new Error("Gagal mengambil data");
  const json = await res.json();
  return json.data;
};

export default function EditGuruPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // State Upload & Cropper
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImgSrc, setTempImgSrc] = useState<string | null>(null);

  // State Dinamis
  const [pendidikanList, setPendidikanList] = useState<PendidikanState[]>([]);

  // Query Data
  const { data: guru, isLoading, isError } = useQuery({
    queryKey: ["guru", id],
    queryFn: () => fetchGuruById(id),
  });

  // Populate Data saat Fetch Selesai
  useEffect(() => {
    if (guru) {
      if (guru.foto) setImagePreview(guru.foto);
      // Jika pendidikan kosong, beri array kosong agar tidak error
      setPendidikanList(guru.pendidikan && guru.pendidikan.length > 0 ? guru.pendidikan : [{ jenjang: "", instansi: "", tahun: "" }]);
    }
  }, [guru]);

  // --- LOGIC PENDIDIKAN ---
  const addPendidikan = () => {
    setPendidikanList([...pendidikanList, { jenjang: "", instansi: "", tahun: "" }]);
  };

  const removePendidikan = (index: number) => {
    const newList = [...pendidikanList];
    newList.splice(index, 1);
    setPendidikanList(newList);
  };

  const updatePendidikan = (index: number, field: keyof PendidikanState, value: string) => {
    const newList = [...pendidikanList];
    newList[index][field] = value;
    setPendidikanList(newList);
  };

  // --- LOGIC IMAGE ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("File max 5MB");
      const reader = new FileReader();
      reader.onload = () => { setTempImgSrc(reader.result as string); setShowCropper(true); };
      reader.readAsDataURL(file);
      e.target.value = ""; 
    }
  };

  const onCropComplete = (croppedFile: File) => {
    setSelectedFile(croppedFile);
    setImagePreview(URL.createObjectURL(croppedFile));
    setShowCropper(false);
    setTempImgSrc(null);
  };

  // --- MUTATION UPDATE ---
  const updateMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await fetch(`/api/guru/${id}`, {
        method: "PUT",
        body: payload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal update");
      return data;
    },
    onSuccess: () => {
      toast.success("Data berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["guru"] });
      router.push("/admin/guru");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = new FormData();

    // Append Text Data
    ["nama", "nip", "jabatan", "kategori", "mataPelajaran", "email", "noHp", "bio"].forEach(key => {
        payload.append(key, formData.get(key) as string);
    });
    
    // Status Checkbox
    payload.append("status", String(formData.get("status") === "on"));

    // Append Pendidikan
    const validPendidikan = pendidikanList.filter(p => p.instansi && p.tahun);
    payload.append("pendidikan", JSON.stringify(validPendidikan));

    // Append Foto Baru (Jika ada)
    if (selectedFile) {
      payload.append("foto", selectedFile);
    }

    updateMutation.mutate(payload);
  };

  // --- MUTATION DELETE ---
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/guru/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Data dihapus permanen.");
      queryClient.invalidateQueries({ queryKey: ["guru"] });
      router.push("/admin/guru");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleDelete = () => {
    if (confirm("⚠️ Yakin hapus data ini? Foto & Data akan hilang permanen.")) {
      deleteMutation.mutate();
    }
  };

  // Loading State
  if (isLoading) return <div className="p-10 text-center animate-pulse">Memuat data...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Data tidak ditemukan!</div>;

  // Styles
  const labelStyle = "block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide";
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-950 text-sm transition-all";

  return (
    <div className="space-y-6 pb-10">
      
      {/* Cropper */}
      {showCropper && tempImgSrc && (
        <ImageCropperModal imageSrc={tempImgSrc} onCancel={() => setShowCropper(false)} onCropComplete={onCropComplete} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/guru" className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-colors shadow-sm">
            <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Edit Data Pengajar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Perbarui profil, jabatan, dan riwayat pendidikan.</p>
          </div>
        </div>
        <button onClick={handleDelete} disabled={deleteMutation.isPending} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors text-sm font-semibold">
          {deleteMutation.isPending ? "Menghapus..." : <><HiTrash size={18} /> Hapus Data</>}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: Foto, Bio, Status */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#DFEBF7] dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
             <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 bg-white shadow-lg group">
                {imagePreview ? (
                   imagePreview.startsWith("data:") || imagePreview.startsWith("blob:") ?
                     <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> :
                     <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                   <div className="flex items-center justify-center h-full text-blue-200"><HiPhoto size={64}/></div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs">Ubah Foto</div>
             </div>
             <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
                <HiOutlineCloudArrowUp size={18} /> Ganti Foto
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
             </label>
           </div>

           <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
             <label className={labelStyle}>Tentang Saya (Bio)</label>
             <textarea name="bio" defaultValue={guru.bio} rows={6} className={inputStyle} ></textarea>
           </div>

           {/* Status Aktif */}
           <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 p-6 flex justify-between items-center shadow-sm">
             <span className="font-bold text-gray-700 dark:text-white">Status Aktif</span>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" name="status" defaultChecked={guru.status} className="sr-only peer" />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
             </label>
           </div>
        </div>

        {/* KOLOM KANAN: Data Diri & Pendidikan */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-600"><HiUser size={20}/></div>
                <h3 className="font-bold text-gray-800 dark:text-white">Informasi & Kontak</h3>
             </div>
             
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <label className={labelStyle}>Nama Lengkap & Gelar</label>
                   <input type="text" name="nama" defaultValue={guru.nama} required className={inputStyle} />
                </div>
                
                <div>
                   <label className={labelStyle}>NIP / NUPTK</label>
                   <input type="text" name="nip" defaultValue={guru.nip} required className={`${inputStyle} font-mono`} />
                </div>
                
                <div>
                   <label className={labelStyle}>Kategori Pegawai</label>
                   <select name="kategori" defaultValue={guru.kategori} className={inputStyle}>
                      <option value="Guru">Tenaga Pengajar (Guru)</option>
                      <option value="Karyawan">Staf / Karyawan (TU)</option>
                   </select>
                </div>
                
                {/* JABATAN DROPDOWN - UPDATE TERBARU */}
                <div>
                   <label className={labelStyle}>Jabatan Struktural</label>
                   <select name="jabatan" defaultValue={guru.jabatan} className={inputStyle} required>
                        <option value="">-- Pilih Jabatan --</option>
                        <option value="Kepala Sekolah">Kepala Sekolah</option>
                        <option value="Waka Kurikulum">Waka Kurikulum</option>
                        <option value="Waka Kesiswaan">Waka Kesiswaan</option>
                        <option value="Waka Sarpras">Waka Sarpras</option>
                        <option value="Waka Humas">Waka Humas</option>
                        <option value="Pengajar">Pengajar / Guru Mapel</option>
                        <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                        <option value="Staf Administrasi">Staf Administrasi</option>
                        <option value="Laboran">Laboran</option>
                        <option value="Pustakawan">Pustakawan</option>
                        <option value="Lainnya">Lainnya</option>
                   </select>
                </div>

                <div>
                   <label className={labelStyle}>Mata Pelajaran</label>
                   <input type="text" name="mataPelajaran" defaultValue={guru.mataPelajaran} className={inputStyle} placeholder="-" />
                </div>

                <div>
                   <label className={labelStyle}>Email Sekolah</label>
                   <div className="relative">
                      <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input type="email" name="email" defaultValue={guru.email} className={`${inputStyle} pl-10`} />
                   </div>
                </div>

                <div>
                   <label className={labelStyle}>Kontak Kantor / HP</label>
                   <div className="relative">
                      <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input type="text" name="noHp" defaultValue={guru.noHp} className={`${inputStyle} pl-10`} />
                   </div>
                </div>
             </div>
          </div>

          {/* RIWAYAT PENDIDIKAN */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-50 dark:bg-white/10 rounded-lg text-purple-600"><HiAcademicCap size={20}/></div>
                   <h3 className="font-bold text-gray-800 dark:text-white">Riwayat Pendidikan</h3>
                </div>
                <button type="button" onClick={addPendidikan} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1 transition-colors">
                   <HiPlus/> Tambah Baris
                </button>
             </div>
             
             <div className="p-6 space-y-4">
               {pendidikanList.map((item, idx) => (
                 <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start animate-in slide-in-from-left-2 duration-300">
                    <div className="w-full sm:w-24 shrink-0">
                       <input 
                         type="text" 
                         className={`${inputStyle} text-center`} 
                         value={item.jenjang}
                         onChange={(e) => updatePendidikan(idx, "jenjang", e.target.value)}
                         list="jenjang-list"
                         placeholder="Jenjang"
                       />
                    </div>
                    <div className="w-full sm:flex-1">
                       <input 
                         type="text" 
                         className={inputStyle}
                         value={item.instansi}
                         onChange={(e) => updatePendidikan(idx, "instansi", e.target.value)}
                         placeholder="Nama Universitas / Sekolah"
                       />
                    </div>
                    <div className="w-full sm:w-24 shrink-0">
                       <input 
                         type="number" 
                         className={`${inputStyle} text-center`}
                         value={item.tahun}
                         onChange={(e) => updatePendidikan(idx, "tahun", e.target.value)}
                         placeholder="Thn"
                       />
                    </div>
                    <button type="button" onClick={() => removePendidikan(idx)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <HiTrash size={18} />
                    </button>
                 </div>
               ))}
               <datalist id="jenjang-list"><option value="S3"/><option value="S2"/><option value="S1"/><option value="D4"/><option value="D3"/><option value="SMA"/></datalist>
             </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
             <Link href="/admin/guru" className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold transition-colors">Batal</Link>
             <button type="submit" disabled={updateMutation.isPending} className="px-8 py-3 bg-blue-950 text-white font-bold rounded-lg hover:bg-blue-900 shadow-lg disabled:opacity-70 flex items-center gap-2 transition-all active:scale-95">
                {updateMutation.isPending ? "Menyimpan..." : <><HiCheck size={20}/> Simpan Perubahan</>}
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}