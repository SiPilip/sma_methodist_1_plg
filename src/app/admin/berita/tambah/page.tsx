"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic"; 
import { 
  HiArrowLeft, 
  HiCheck, 
  HiPhoto, 
  HiCalendarDays,
  HiTag,
  HiEye
} from "react-icons/hi2";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-50 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Editor...</div>
});

export default function TambahBeritaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kegiatan");
  const [status, setStatus] = useState("Published");
  const [content, setContent] = useState(""); 

  // --- PERBAIKAN DISINI ---
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }], 
        ['bold', 'italic', 'underline', 'strike', 'blockquote'], 
        [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
        [{ 'align': [] }], 
        ['link', 'image'], 
        ['clean'] 
      ],
    }
  }), []);

  // Hapus 'bullet' dari sini, cukup 'list' saja
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', // 'list' sudah mencakup ordered & bullet
    'align',
    'link', 'image'
  ];
  // ------------------------

  // Handle Cover Image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = { 
        title, 
        category, 
        status, 
        content, 
        coverImage: imagePreview 
    };
    
    console.log("Publishing Article:", payload);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/berita"); 
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/berita" 
            className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 hover:text-blue-950 transition-colors shadow-sm"
          >
            <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Tulis Artikel Baru</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bagikan kabar terbaru, prestasi, atau pengumuman sekolah.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70 text-sm"
            >
                {isSubmitting ? "Menyimpan..." : <><HiCheck size={18} /> Publikasikan</>}
            </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM UTAMA (EDITOR) */}
        <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-6 md:p-8 min-h-[600px]">
                
                <input 
                    type="text" 
                    placeholder="Judul Artikel..." 
                    className="w-full text-3xl md:text-4xl font-bold text-gray-800 dark:text-white placeholder-gray-300 border-none focus:ring-0 px-0 bg-transparent mb-6"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <div className="prose-editor-wrapper">
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    modules={modules}
                    formats={formats}
                    placeholder="Mulai menulis cerita, sisipkan gambar, dan format teks di sini..."
                    className="h-[400px] mb-12 text-gray-700 dark:text-gray-300"
                  />
                </div>
                
            </div>
        </div>

        {/* KOLOM SIDEBAR (PENGATURAN) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PUBLIKASI */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="bg-gray-50 dark:bg-white/5 px-4 py-3 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status & Jadwal</h3>
            </div>
            <div className="p-5 space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status Publikasi</label>
                    <select 
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-950"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Published">Published (Tayang)</option>
                        <option value="Draft">Draft (Konsep)</option>
                        <option value="Archived">Archived (Arsip)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tanggal Tayang</label>
                    <div className="relative">
                        <HiCalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="date" className="w-full pl-9 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-950" />
                    </div>
                </div>
            </div>
          </div>

          {/* KATEGORI */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="bg-gray-50 dark:bg-white/5 px-4 py-3 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</h3>
            </div>
            <div className="p-5">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Kategori Utama</label>
                <div className="relative">
                    <HiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <select 
                        className="w-full pl-9 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-950"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Kegiatan">Kegiatan Sekolah</option>
                        <option value="Prestasi">Prestasi Siswa</option>
                        <option value="Pengumuman">Pengumuman</option>
                        <option value="Artikel">Artikel Umum</option>
                    </select>
                </div>
            </div>
          </div>

          {/* THUMBNAIL */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
             <div className="bg-gray-50 dark:bg-white/5 px-4 py-3 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gambar Sampul</h3>
            </div>
            <div className="p-5">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-white/5 group cursor-pointer">
                    {imagePreview ? (
                        <>
                            <Image src={imagePreview} alt="Thumbnail" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">Ganti Gambar</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                             <HiPhoto size={32} className="mb-2"/>
                             <span className="text-xs">Upload Thumbnail</span>
                        </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">Rasio 16:9 disarankan.</p>
            </div>
          </div>

        </div>
      </form>

      {/* CUSTOM CSS UNTUK EDITOR */}
      <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: #f9fafb;
          border-color: #e5e7eb !important;
        }
        .dark .ql-toolbar {
          background-color: #1a202c;
          border-color: #374151 !important;
        }
        .dark .ql-stroke {
          stroke: #9ca3af !important;
        }
        .dark .ql-fill {
          fill: #9ca3af !important;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #e5e7eb !important;
          font-family: inherit;
          font-size: 1.125rem;
        }
        .dark .ql-container {
          border-color: #374151 !important;
          color: white;
        }
        .ql-editor {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
}