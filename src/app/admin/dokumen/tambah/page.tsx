"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { HiArrowLeft, HiOutlineCloudArrowUp, HiCheck, HiDocumentText } from "react-icons/hi2";

export default function TambahDokumenPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/dokumen", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Dokumen berhasil diupload!");
      router.push("/admin/dokumen");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return toast.error("Pilih file terlebih dahulu!");

    const formData = new FormData(e.currentTarget);
    // File sudah otomatis masuk karena input name="file" ada di form
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-4 border-b pb-6">
        <Link href="/admin/dokumen" className="p-2.5 rounded-full bg-white border hover:bg-gray-50">
          <HiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upload Dokumen</h1>
          <p className="text-sm text-gray-500">Tambahkan file baru ke arsip.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card Upload */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
           
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Judul Dokumen</label>
              <input type="text" name="judul" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Kalender Akademik 2025/2026" />
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
              <select name="kategori" className="w-full px-4 py-2 border rounded-lg bg-white" defaultValue="Akademik">
                 <option value="Akademik">Akademik</option>
                 <option value="Surat Keputusan">Surat Keputusan (SK)</option>
                 <option value="Formulir">Formulir</option>
                 <option value="Lainnya">Lainnya</option>
              </select>
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi Singkat (Opsional)</label>
              <textarea name="deskripsi" rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Keterangan tambahan tentang file ini..."></textarea>
           </div>

           {/* Dropzone Area */}
           <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">File Dokumen</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                 <input 
                    type="file" 
                    name="file"
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png" // Filter file umum
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                 />
                 
                 {file ? (
                    <div className="flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                       <HiDocumentText size={24}/>
                       <span className="font-bold text-sm">{file.name}</span>
                       <span className="text-xs text-blue-400">({(file.size/1024/1024).toFixed(2)} MB)</span>
                    </div>
                 ) : (
                    <>
                       <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3"><HiOutlineCloudArrowUp size={24}/></div>
                       <p className="font-bold text-gray-700">Klik atau Drag file ke sini</p>
                       <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, JPG. Maks 10MB.</p>
                    </>
                 )}
              </div>
           </div>
        </div>

        <div className="flex justify-end gap-3">
           <Link href="/admin/dokumen" className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-semibold text-gray-600">Batal</Link>
           <button 
              type="submit" 
              disabled={mutation.isPending || !file} 
              className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg"
           >
              {mutation.isPending ? "Mengupload..." : <><HiCheck/> Simpan Dokumen</>}
           </button>
        </div>

      </form>
    </div>
  );
}