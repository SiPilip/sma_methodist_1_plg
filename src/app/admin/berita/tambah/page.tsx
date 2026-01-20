"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  HiArrowLeft, HiPhoto, HiOutlineCloudArrowUp, HiCheck,
  HiNewspaper, HiTag, HiEye
} from "react-icons/hi2";

// Import Komponen Custom Kita
import ImageCropperModal from "@/components/ImageCropperModal"; 
import RichTextEditor from "@/components/RichTextEditor"; 

export default function TambahBeritaPage() {
  const router = useRouter();

  // State Form
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Berita");
  const [status, setStatus] = useState("Published");
  const [konten, setKonten] = useState(""); // State untuk Rich Text

  // State Gambar
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImgSrc, setTempImgSrc] = useState<string | null>(null);

  // --- LOGIC IMAGE CROPPER ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("Maksimal 5MB");
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

  // --- MUTATION SUBMIT ---
  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await fetch("/api/berita", {
        method: "POST",
        body: payload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan");
      return data;
    },
    onSuccess: () => {
      toast.success("Berita berhasil diterbitkan!");
      router.push("/admin/berita");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (!judul || !konten) {
      return toast.error("Judul dan Konten wajib diisi!");
    }

    const payload = new FormData();
    payload.append("judul", judul);
    payload.append("kategori", kategori);
    payload.append("status", status);
    payload.append("konten", konten); // HTML String dari Editor

    if (selectedFile) {
      payload.append("thumbnail", selectedFile);
    }

    mutation.mutate(payload);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Cropper Modal */}
      {showCropper && tempImgSrc && (
        <ImageCropperModal imageSrc={tempImgSrc} onCancel={() => setShowCropper(false)} onCropComplete={onCropComplete} />
      )}

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <Link href="/admin/berita" className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-colors shadow-sm">
          <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Tulis Berita Baru</h1>
          <p className="text-sm text-gray-500">Bagikan informasi terbaru sekolah.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: EDITOR UTAMA */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Input Judul */}
           <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 border border-gray-200 dark:border-white/5 shadow-sm">
              <input 
                type="text" 
                placeholder="Judul Berita yang Menarik..." 
                className="w-full text-2xl font-bold placeholder-gray-300 border-none focus:ring-0 p-0 bg-transparent text-gray-800 dark:text-white"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                autoFocus
              />
           </div>

           {/* Rich Text Editor */}
           <div className="bg-white dark:bg-[#1a202c] rounded-xl p-1 border border-gray-200 dark:border-white/5 shadow-sm min-h-[400px]">
              <RichTextEditor 
                value={konten} 
                onChange={setKonten} 
                placeholder="Mulai menulis cerita Anda di sini..."
              />
           </div>

        </div>

        {/* KOLOM KANAN: SIDEBAR PENGATURAN */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Card Publish */}
           <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><HiNewspaper/> Penerbitan</h3>
              
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                 <select 
                    className="w-full mt-1 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                 >
                    <option value="Published">Langsung Tayang (Published)</option>
                    <option value="Draft">Simpan Konsep (Draft)</option>
                 </select>
              </div>

              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                 <div className="relative mt-1">
                    <HiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <select 
                       className="w-full pl-9 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700"
                       value={kategori}
                       onChange={(e) => setKategori(e.target.value)}
                    >
                       <option value="Berita">Berita Sekolah</option>
                       <option value="Prestasi">Prestasi Siswa</option>
                       <option value="Artikel">Artikel Pendidikan</option>
                       <option value="Pengumuman">Pengumuman</option>
                       <option value="Kegiatan">Kegiatan / Event</option>
                    </select>
                 </div>
              </div>

              <div className="pt-4 border-t flex gap-3">
                 <Link href="/admin/berita" className="flex-1 py-2 text-center border rounded-lg hover:bg-gray-50 text-sm font-semibold">Batal</Link>
                 <button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold flex items-center justify-center gap-2"
                 >
                    {mutation.isPending ? "Menyimpan..." : <><HiCheck/> Terbitkan</>}
                 </button>
              </div>
           </div>

           {/* Card Thumbnail */}
           <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><HiPhoto/> Gambar Sampul</h3>
              
              <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center relative group">
                 {imagePreview ? (
                    <>
                       <Image src={imagePreview} alt="Thumbnail" fill className="object-cover" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">Klik untuk ganti</span>
                       </div>
                    </>
                 ) : (
                    <div className="text-center p-4">
                       <HiPhoto className="mx-auto text-gray-300 text-4xl mb-2"/>
                       <p className="text-xs text-gray-400">Klik untuk upload thumbnail</p>
                    </div>
                 )}
                 
                 <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={handleImageChange}
                 />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">Rasio 16:9 disarankan. Max 5MB.</p>
           </div>

        </div>
      </form>
    </div>
  );
}