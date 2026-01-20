"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as XLSX from "xlsx";
import { 
  HiArrowLeft, 
  HiPhoto, 
  HiCheck,
  HiOutlineCloudArrowUp,
  HiUser,
  HiAcademicCap,
  HiDocumentText,
  HiTableCells,
  HiTrash,
  HiArrowDownTray
} from "react-icons/hi2";

export default function TambahSiswaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State Tab
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");

  // State Manual Form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State Excel Import
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- LOGIC MANUAL FORM ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi Submit
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/siswa"); 
    }, 1500);
  };

  // --- LOGIC EXCEL IMPORT ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setExcelFile(file);
    readExcel(file);
  };

  const readExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setPreviewData(parsedData.slice(0, 5)); // Preview 5 data teratas
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setExcelFile(file);
      readExcel(file);
    }
  };

  const handleImportSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Berhasil mengimport ${previewData.length} data siswa (Simulasi)`);
      router.push("/admin/siswa");
    }, 2000);
  };

  const downloadTemplate = () => {
    // Template Excel dengan Field LENGKAP sesuai Frontend
    const templateData = [
      { 
        Nama_Lengkap: "Contoh Siswa", 
        NISN: "0012345678",
        NIK: "167101234567890",
        Tempat_Lahir: "Palembang",
        Tanggal_Lahir: "2008-01-31", // Format ISO agar aman
        Jenis_Kelamin: "L",
        Agama: "Kristen",
        Tingkat_Kelas: "X",
        Jurusan: "IPA", 
        Angkatan: 2026,
        Wali_Kelas: "Oliver Granli" 
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Siswa");
    XLSX.writeFile(wb, "Template_Import_Siswa_Lengkap.xlsx");
  };

  // Styles Konsisten
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-500 focus:border-blue-950 text-sm transition-all";
  const labelStyle = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/siswa" className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-colors shadow-sm">
            <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Tambah Siswa Baru</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pilih metode input data siswa.</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex text-sm font-medium">
          <button 
            onClick={() => setActiveTab("manual")}
            className={`px-4 py-2 rounded-md transition-all ${activeTab === "manual" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-950 dark:text-white" : "text-gray-500 hover:text-gray-700"}`}
          >
            Input Manual
          </button>
          <button 
            onClick={() => setActiveTab("import")}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${activeTab === "import" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-950 dark:text-white" : "text-gray-500 hover:text-gray-700"}`}
          >
            <HiDocumentText /> Import Excel
          </button>
        </div>
      </div>

      {/* --- TAB 1: MANUAL INPUT (DATA LENGKAP DIKEMBALIKAN) --- */}
      {activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Kolom Kiri: Foto & Status */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#DFEBF7] dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
              <h3 className="font-bold text-blue-950 dark:text-white mb-6">Foto Profil Siswa</h3>
              <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg group">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-blue-200/50 dark:bg-white/5 text-blue-950/50 dark:text-white/50">
                    <HiPhoto size={64} />
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
              <p className="text-xs text-blue-900/60 dark:text-blue-200/60 mt-3 max-w-[200px]">
                Disarankan rasio 1:1. Format JPG/PNG, maks 2MB.
              </p>
            </div>

             {/* Card Status */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
                <div className="bg-blue-950 px-6 py-3 border-b border-gray-100 dark:border-white/10">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Status Akademik</h3>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                      <p className="font-semibold text-gray-800 dark:text-white">Status Aktif</p>
                      <p className="text-xs text-gray-500">Nonaktifkan jika siswa cuti.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Data Lengkap */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. INFORMASI PRIBADI */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden border-l-4 border-l-blue-950">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
                 <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-950 dark:text-white"><HiUser size={20} /></div>
                 <h3 className="font-bold text-lg text-gray-800 dark:text-white">Informasi Pribadi</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelStyle}>Nama Lengkap</label>
                  <input type="text" required className={inputStyle} placeholder="Sesuai Akta Kelahiran" />
                </div>
                <div>
                  <label className={labelStyle}>NISN</label>
                  <input type="text" required className={`${inputStyle} font-mono`} placeholder="Nomor Induk Siswa Nasional" />
                </div>
                <div>
                  <label className={labelStyle}>NIK</label>
                  <input type="text" className={`${inputStyle} font-mono`} placeholder="Nomor Induk Kependudukan" />
                </div>
                <div>
                  <label className={labelStyle}>Tempat Lahir</label>
                  <input type="text" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Tanggal Lahir</label>
                  <input type="date" className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Jenis Kelamin</label>
                  <select className={inputStyle}>
                    <option value="">Pilih...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Agama</label>
                  <select className={inputStyle}>
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
                 <div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-600 dark:text-white"><HiAcademicCap size={20} /></div>
                 <h3 className="font-bold text-lg text-gray-800 dark:text-white">Informasi Akademik</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className={labelStyle}>Tingkat Kelas</label>
                    <select className={inputStyle}>
                      <option value="X">Kelas X</option>
                      <option value="XI">Kelas XI</option>
                      <option value="XII">Kelas XII</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelStyle}>Jurusan / Peminatan</label>
                    <select className={inputStyle}>
                      <option value="IPA">MIPA (Matematika & IPA)</option>
                      <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelStyle}>Angkatan (Tahun Masuk)</label>
                    <input type="number" defaultValue={2026} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>Wali Kelas</label>
                    <input type="text" placeholder="Cari Guru..." className={inputStyle} />
                  </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70">
                {isSubmitting ? "Menyimpan..." : <><HiCheck size={20} /> Simpan Data Siswa</>}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* --- TAB 2: IMPORT EXCEL (Template Juga Diupdate) --- */}
      {activeTab === "import" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Kolom Kiri: Upload Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-6">
               <h3 className="font-bold text-gray-800 dark:text-white mb-2">1. Download Template</h3>
               <p className="text-sm text-gray-500 mb-4">Gunakan template resmi (Lengkap) agar format data sesuai sistem.</p>
               <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors font-semibold text-sm">
                  <HiArrowDownTray size={18} /> Download Template Excel
               </button>
            </div>

            <div 
              className="bg-white dark:bg-[#1a202c] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
               <div className="w-16 h-16 bg-blue-50 dark:bg-white/5 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <HiOutlineCloudArrowUp size={32} />
               </div>
               <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                  {excelFile ? excelFile.name : "Klik atau Drop File Excel"}
               </h3>
               <p className="text-sm text-gray-400">Format .xlsx atau .xls</p>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".xlsx, .xls" 
                  onChange={handleFileUpload} 
               />
               
               {excelFile && (
                 <button 
                  onClick={(e) => { e.stopPropagation(); setExcelFile(null); setPreviewData([]); }}
                  className="mt-4 text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                 >
                   <HiTrash /> Hapus File
                 </button>
               )}
            </div>
          </div>

          {/* Kolom Kanan: Preview Data */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <HiTableCells className="text-blue-600" />
                    <h3 className="font-bold text-gray-800 dark:text-white">Preview Data</h3>
                 </div>
                 {previewData.length > 0 && (
                   <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-bold">
                     Menampilkan 5 Data Teratas
                   </span>
                 )}
              </div>

              <div className="flex-1 p-0 overflow-x-auto min-h-[300px]">
                {previewData.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-white/5">
                      <tr>
                        {Object.keys(previewData[0]).map((key) => (
                          <th key={key} className="px-4 py-3 border-b whitespace-nowrap">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                          {Object.values(row).map((val: any, i) => (
                            <td key={i} className="px-4 py-3 whitespace-nowrap">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10">
                    <HiDocumentText size={48} className="mb-2 opacity-20" />
                    <p>Upload file excel untuk melihat preview data di sini.</p>
                  </div>
                )}
              </div>

              {/* Footer Action */}
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex justify-between items-center">
                 <div className="text-xs text-gray-500">
                    {previewData.length > 0 ? `${previewData.length} baris terbaca.` : "Menunggu file..."}
                 </div>
                 <button 
                  onClick={handleImportSubmit}
                  disabled={!excelFile || isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isProcessing ? "Mengimport..." : "Import Semua Data"}
                 </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}