"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  HiArrowLeft, HiPhoto, HiOutlineCloudArrowUp, HiCheck,
  HiNewspaper, HiTag, HiTrash
} from "react-icons/hi2";

import ImageCropperModal from "@/components/ImageCropperModal"; 
import RichTextEditor from "@/components/RichTextEditor"; 

const fetchBeritaById = async (id: string) => {
  const res = await fetch(`/api/berita/${id}`);
  if (!res.ok) throw new Error("Gagal ambil data");
  const json = await res.json();
  return json.data;
};

export default function EditBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  // State Form
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Berita");
  const [status, setStatus] = useState("Published");
  const [konten, setKonten] = useState(""); 

  // State Gambar
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImgSrc, setTempImgSrc] = useState<string | null>(null);

  // Query Data
  const { data: berita, isLoading, isError } = useQuery({ // Ambil isError
    queryKey: ["berita", id],
    queryFn: () => fetchBeritaById(id),
    retry: false, // JANGAN RETRY jika error (langsung tampilkan 404)
  });

  // Load Data to State
  useEffect(() => {
    if (berita) {
      setJudul(berita.judul);
      setKategori(berita.kategori);
      setStatus(berita.status);
      setKonten(berita.konten);
      if (berita.thumbnail) setImagePreview(berita.thumbnail);
    }
  }, [berita]);

  // --- LOGIC IMAGE ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
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
      const res = await fetch(`/api/berita/${id}`, {
        method: "PUT",
        body: payload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Berita diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["berita"] });
      router.push("/admin/berita");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !konten) return toast.error("Judul & Konten wajib diisi");

    const payload = new FormData();
    payload.append("judul", judul);
    payload.append("kategori", kategori);
    payload.append("status", status);
    payload.append("konten", konten);

    if (selectedFile) payload.append("thumbnail", selectedFile);

    updateMutation.mutate(payload);
  };

  // --- DELETE ---
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/berita/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Berita dihapus");
      queryClient.invalidateQueries({ queryKey: ["berita"] });
      router.push("/admin/berita");
    }
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-red-100 p-6 rounded-full">
           <HiNewspaper className="text-red-500 text-6xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Berita Tidak Ditemukan</h2>
        <p className="text-gray-500 max-w-md">
          Halaman yang Anda cari mungkin telah dihapus atau URL yang Anda masukkan salah.
        </p>
        <Link 
          href="/admin/berita" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all"
        >
          Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  if (isLoading) return <div className="p-10 text-center animate-pulse">Memuat...</div>;

  return (
    <div className="space-y-6 pb-20">
      {showCropper && tempImgSrc && <ImageCropperModal imageSrc={tempImgSrc} onCancel={() => setShowCropper(false)} onCropComplete={onCropComplete} />}

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/berita" className="p-2 bg-white rounded-full border hover:bg-gray-50"><HiArrowLeft size={20}/></Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Berita</h1>
            <p className="text-sm text-gray-500">Perbarui konten artikel.</p>
          </div>
        </div>
        <button onClick={() => confirm("Hapus berita ini?") && deleteMutation.mutate()} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-sm border border-red-200">
           <HiTrash className="inline mr-1"/> Hapus
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* EDITOR */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-6 rounded-xl border">
              <input type="text" className="w-full text-2xl font-bold border-none p-0 focus:ring-0" value={judul} onChange={(e)=>setJudul(e.target.value)} />
           </div>
           <div className="bg-white p-1 rounded-xl border min-h-[400px]">
              <RichTextEditor value={konten} onChange={setKonten} />
           </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-6 rounded-xl border space-y-4">
              <h3 className="font-bold flex items-center gap-2"><HiNewspaper/> Pengaturan</h3>
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                 <select className="w-full mt-1 p-2 border rounded-lg" value={status} onChange={(e)=>setStatus(e.target.value)}>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Kategori</label>
                 <select className="w-full mt-1 p-2 border rounded-lg" value={kategori} onChange={(e)=>setKategori(e.target.value)}>
                    <option value="Berita">Berita</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Artikel">Artikel</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Kegiatan">Kegiatan</option>
                 </select>
              </div>
              <button type="submit" disabled={updateMutation.isPending} className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                 {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
           </div>

           <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-bold mb-4 flex items-center gap-2"><HiPhoto/> Thumbnail</h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-dashed bg-gray-50 relative group flex items-center justify-center">
                 {imagePreview ? (
                    <Image src={imagePreview} alt="Thumbnail" fill className="object-cover" />
                 ) : (
                    <span className="text-gray-400 text-xs">Belum ada gambar</span>
                 )}
                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
              </div>
           </div>
        </div>

      </form>
    </div>
  );
}