"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  HiArrowLeft, 
  HiCheck, 
  HiOutlineCloudArrowUp,
  HiDocumentText,
  HiTrash,
  HiInformationCircle
} from "react-icons/hi2";
import { BsFileEarmarkPdfFill, BsFileEarmarkWordFill, BsFileEarmarkExcelFill } from "react-icons/bs";

export default function TambahDokumenPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Simulasi Progress Bar

  // State Form
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Akademik");
  const [description, setDescription] = useState("");

  // Helper Icon File
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return <BsFileEarmarkPdfFill className="text-red-500" size={40} />;
    if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) return <BsFileEarmarkWordFill className="text-blue-500" size={40} />;
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) return <BsFileEarmarkExcelFill className="text-green-500" size={40} />;
    return <HiDocumentText className="text-gray-400" size={40} />;
  };

  // --- LOGIC FILE HANDLING ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file: File) => {
    // Validasi Ukuran (Misal Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 10MB.");
      return;
    }
    setFile(file);
    // Otomatis isi nama dokumen dari nama file (opsional)
    if (!name) setName(file.name.split('.')[0]);
  };

  // --- SUBMIT ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Harap pilih file terlebih dahulu!");

    setIsSubmitting(true);
    setUploadProgress(0);

    // Simulasi Progress Upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulasi Selesai
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Dokumen berhasil diupload!");
      router.push("/admin/dokumen"); 
    }, 2500);
  };

  // Styles
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-500 focus:border-blue-950 text-sm transition-all";
  const labelStyle = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <Link 
          href="/admin/dokumen" 
          className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 hover:text-blue-950 transition-colors shadow-sm"
        >
          <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Upload Dokumen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Arsipkan SK, Jadwal, atau Dokumen Akademik lainnya.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- KOLOM KIRI: AREA UPLOAD --- */}
        <div className="lg:col-span-5 space-y-6">
          <div 
            className={`bg-white dark:bg-[#1a202c] rounded-2xl border-2 border-dashed ${file ? 'border-green-400 bg-green-50/50' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'} p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group h-[300px] relative overflow-hidden`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" 
                onChange={handleFileChange} 
             />

             {file ? (
                // Tampilan Setelah File Dipilih
                <div className="animate-in zoom-in duration-300">
                   <div className="mb-4 flex justify-center">{getFileIcon(file.name)}</div>
                   <h3 className="font-bold text-gray-800 dark:text-white break-all max-w-[200px] mx-auto">{file.name}</h3>
                   <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                   
                   <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setUploadProgress(0); }}
                    className="mt-6 px-4 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-2 mx-auto"
                   >
                     <HiTrash /> Ganti File
                   </button>
                </div>
             ) : (
                // Tampilan Belum Ada File
                <>
                  <div className="w-20 h-20 bg-blue-50 dark:bg-white/5 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <HiOutlineCloudArrowUp size={40} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                      Klik atau Drop File Disini
                  </h3>
                  <p className="text-sm text-gray-400 max-w-[250px] leading-relaxed">
                      Mendukung format PDF, Word, Excel, dan PowerPoint. (Maks 10MB)
                  </p>
                </>
             )}

             {/* Progress Bar (Overlay) */}
             {isSubmitting && (
               <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 flex flex-col items-center justify-center z-10">
                  <div className="w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4 overflow-hidden">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-sm font-bold text-blue-900 dark:text-white animate-pulse">Mengupload... {uploadProgress}%</p>
               </div>
             )}
          </div>
          
          <div className="flex gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
             <HiInformationCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
             <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                Dokumen yang diupload akan bersifat <strong>Publik</strong> dan dapat didownload oleh siapa saja melalui halaman "Akademik & Dokumen".
             </p>
          </div>
        </div>

        {/* --- KOLOM KANAN: FORM METADATA --- */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="bg-gray-50 dark:bg-white/5 px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                 <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-950 dark:text-white">
                    <HiDocumentText size={20} />
                 </div>
                 <h3 className="font-bold text-lg text-gray-800 dark:text-white">Detail Dokumen</h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className={labelStyle}>Nama Dokumen</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Kalender Akademik 2025/2026" 
                    className={inputStyle}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Kategori</label>
                  <select 
                    className={inputStyle}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Akademik">Akademik (Jadwal, Kalender, Kurikulum)</option>
                    <option value="SK">SK & Surat Keputusan</option>
                    <option value="Administrasi">Formulir & Administrasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Keterangan (Opsional)</label>
                  <textarea 
                    rows={4} 
                    placeholder="Deskripsi singkat tentang isi dokumen..." 
                    className={inputStyle}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !file}
                        className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                        {isSubmitting ? "Memproses..." : <><HiCheck size={18} /> Upload Dokumen</>}
                    </button>
                </div>
              </div>
           </div>
        </div>

      </form>
    </div>
  );
}