"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as XLSX from "xlsx";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  HiArrowLeft, HiPhoto, HiCheck, HiOutlineCloudArrowUp,
  HiUser, HiAcademicCap, HiDocumentText, HiTableCells,
  HiTrash, HiArrowDownTray
} from "react-icons/hi2";
import ImageCropperModal from "@/components/ImageCropperModal"; // Import Cropper

export default function TambahSiswaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State Import
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // STATE BARU UNTUK CROPPER
  const [showCropper, setShowCropper] = useState(false);
  const [tempImgSrc, setTempImgSrc] = useState<string | null>(null);

  // --- LOGIC TAHUN AJARAN ---
  // Fungsi Helper: Menghitung Angkatan berdasarkan Kelas yg dipilih user
  const calculateAngkatan = (kelasPilihan: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    
    // Jika bulan sekarang < 7 (Juli), berarti masih tahun ajaran (TahunLalu/TahunSekarang)
    // Jika bulan >= 7, berarti tahun ajaran (TahunSekarang/TahunDepan)
    const schoolYearStart = currentMonth >= 7 ? currentYear : currentYear - 1;
    
    // Kelas 10 = Masuk tahun ini (schoolYearStart)
    // Kelas 11 = Masuk tahun lalu (schoolYearStart - 1)
    // Kelas 12 = Masuk 2 tahun lalu (schoolYearStart - 2)
    const diff = kelasPilihan - 10; 
    return schoolYearStart - diff;
  };

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => { // Tipe payload sekarang FormData
      const res = await fetch("/api/siswa", {
        method: "POST",
        // JANGAN SET HEADER 'Content-Type': 'application/json' 
        // Biarkan browser otomatis set 'multipart/form-data' saat kirim FormData
        body: payload, 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan data");
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Berhasil! ${data.data.nama} ditambahkan.`);
      router.push("/admin/siswa");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Naikkan limit upload awal jadi 5MB (karena nanti dicrop jadi kecil)
        toast.error("File terlalu besar (Max 5MB).");
        return;
      }
      
      // Buat URL sementara agar bisa dibaca Cropper
      const reader = new FileReader();
      reader.onload = () => {
          setTempImgSrc(reader.result as string);
          setShowCropper(true); // Buka Modal
      };
      reader.readAsDataURL(file);
      
      // Reset input agar bisa pilih file yang sama jika dibatalkan
      e.target.value = ""; 
    }
  };

  const onCropComplete = (croppedFile: File) => {
    // 1. Simpan File Asli (Hasil Crop) untuk dikirim ke API
    setSelectedFile(croppedFile);

    // 2. Buat Preview untuk UI
    const objectUrl = URL.createObjectURL(croppedFile);
    setImagePreview(objectUrl);

    // 3. Tutup Modal
    setShowCropper(false);
    setTempImgSrc(null);
  };

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Hitung Angkatan (Logic sama seperti sebelumnya)
    const kelasInput = Number(formData.get("kelas_saat_ini"));
    const angkatanOtomatis = calculateAngkatan(kelasInput);

    // KITA TIDAK PAKAI JSON.STRINGIFY LAGI UNTUK DATA MANUAL
    // Kita susun FormData baru agar bisa menampung File
    const payloadData = new FormData();
    
    payloadData.append("nama", formData.get("nama") as string);
    payloadData.append("nisn", formData.get("nisn") as string);
    payloadData.append("tempatLahir", formData.get("tempatLahir") as string);
    payloadData.append("tanggalLahir", formData.get("tanggalLahir") as string);
    payloadData.append("jenisKelamin", formData.get("jenisKelamin") as string);
    payloadData.append("agama", formData.get("agama") as string);
    payloadData.append("jurusan", formData.get("jurusan") as string);
    payloadData.append("rombel", formData.get("rombel") as string);
    payloadData.append("angkatan", String(angkatanOtomatis)); // FormData butuh string
    
    // Masukkan File Foto jika ada
    if (selectedFile) {
      payloadData.append("foto", selectedFile); 
    }

    // Panggil Mutation (Kirim FormData, bukan JSON object)
    mutation.mutate(payloadData);
  };

  // --- LOGIC EXCEL & TEMPLATE ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => { /* Sama seperti sebelumnya */
     const file = e.target.files?.[0];
     if (!file) return;
     setExcelFile(file);
     readExcel(file);
     toast.success("Excel dimuat");
  };

  const readExcel = (file: File) => { /* Sama seperti sebelumnya */ 
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setPreviewData(parsedData.slice(0, 5)); 
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent) => { /* Sama seperti sebelumnya */ 
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setExcelFile(file);
      readExcel(file);
    }
  };

  const handleImportSubmit = async () => {
    if (!previewData.length) return;
    setIsProcessing(true);
    try {
      const formattedData = previewData.map((row: any) => ({
        nama: row["Nama_Lengkap"],
        nisn: String(row["NISN"]),
        tempatLahir: row["Tempat_Lahir"],
        tanggalLahir: new Date(), 
        jenisKelamin: row["Jenis_Kelamin"],
        agama: row["Agama"],
        jurusan: row["Jurusan"], // IPA / IPS
        rombel: String(row["Rombel"]), // 1 / 2
        angkatan: Number(row["Angkatan"]), // Wajib format tahun (2025)
        status: true
      }));

      const res = await fetch("/api/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success(result.message);
      router.push("/admin/siswa");
    } catch (error: any) {
      toast.error("Gagal Import: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    // Template UPDATE: Tanpa NIK, Tanpa Kelas Statis, Tambah Rombel
    const templateData = [{ 
        Nama_Lengkap: "Budi Santoso", 
        NISN: "0012345678",
        Tempat_Lahir: "Palembang",
        Jenis_Kelamin: "L",
        Agama: "Kristen",
        Jurusan: "IPA", 
        Rombel: "1",     // MIPA 1
        Angkatan: 2025   // Tahun Masuk
    }];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Siswa Baru");
    XLSX.writeFile(wb, "Template_Import_Siswa_V2.xlsx");
  };

  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-950 text-sm transition-all";
  const labelStyle = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6 pb-10">

      {showCropper && tempImgSrc && (
        <ImageCropperModal 
            imageSrc={tempImgSrc}
            onCancel={() => { setShowCropper(false); setTempImgSrc(null); }}
            onCropComplete={onCropComplete}
        />
      )}
      
      {/* Header (Sama) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/siswa" className="p-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 transition-colors shadow-sm">
            <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Tambah Siswa Baru</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Database Siswa Modern & Dinamis</p>
          </div>
        </div>
         <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex text-sm font-medium">
          <button onClick={() => setActiveTab("manual")} className={`px-4 py-2 rounded-md ${activeTab === "manual" ? "bg-white shadow-sm text-blue-950" : "text-gray-500"}`}>Input Manual</button>
          <button onClick={() => setActiveTab("import")} className={`px-4 py-2 rounded-md flex items-center gap-2 ${activeTab === "import" ? "bg-white shadow-sm text-blue-950" : "text-gray-500"}`}><HiDocumentText /> Import Excel</button>
        </div>
      </div>

      {activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="lg:col-span-4 space-y-6">
            {/* Foto Upload (Sama) */}
            <div className="bg-[#DFEBF7] dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-white/5 flex flex-col items-center text-center shadow-sm">
               <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg bg-white">
                {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-blue-200"><HiPhoto size={64} /></div>}
               </div>
               <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2">
                <HiOutlineCloudArrowUp size={18} /> Pilih Foto
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              <p className="text-xs text-blue-900/60 mt-3">Max 1MB. Format JPG/PNG.</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* 1. INFO PRIBADI */}
             <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden border-l-4 border-l-blue-950">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3"><div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-950 dark:text-white"><HiUser size={20} /></div><h3 className="font-bold text-lg text-gray-800 dark:text-white">Informasi Pribadi</h3></div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><label className={labelStyle}>Nama Lengkap</label><input type="text" name="nama" required className={inputStyle} placeholder="Contoh: Alexander Hamilton" /></div>
                <div><label className={labelStyle}>NISN</label><input type="text" name="nisn" required className={`${inputStyle} font-mono`} placeholder="Nomor Induk Siswa" /></div>
                <div><label className={labelStyle}>Tempat Lahir</label><input type="text" name="tempatLahir" className={inputStyle} /></div>
                <div><label className={labelStyle}>Tanggal Lahir</label><input type="date" name="tanggalLahir" className={inputStyle} /></div>
                <div><label className={labelStyle}>Jenis Kelamin</label><select name="jenisKelamin" className={inputStyle} required defaultValue="L"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div><label className={labelStyle}>Agama</label><select name="agama" className={inputStyle} defaultValue="Kristen"><option value="Kristen">Kristen</option><option value="Katolik">Katolik</option><option value="Islam">Islam</option><option value="Buddha">Buddha</option><option value="Hindu">Hindu</option><option value="Konghucu">Konghucu</option></select></div>
              </div>
            </div>

             {/* 2. INFO AKADEMIK (UPDATED LOGIC) */}
             <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden border-l-4 border-l-blue-600">
               <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3"><div className="p-2 bg-blue-50 dark:bg-white/10 rounded-lg text-blue-600 dark:text-white"><HiAcademicCap size={20} /></div><h3 className="font-bold text-lg text-gray-800 dark:text-white">Posisi Kelas Saat Ini</h3></div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                 
                 {/* ADMIN MEMILIH KELAS SAAT INI (10/11/12) */}
                 <div>
                    <label className={labelStyle}>Duduk di Kelas (Sekarang)</label>
                    <select name="kelas_saat_ini" className={inputStyle} required defaultValue="10">
                      <option value="10">Kelas 10 (X)</option>
                      <option value="11">Kelas 11 (XI)</option>
                      <option value="12">Kelas 12 (XII)</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">*Sistem akan otomatis menghitung Angkatan.</p>
                 </div>

                 <div>
                    <label className={labelStyle}>Jurusan</label>
                    <select name="jurusan" className={inputStyle} required defaultValue="IPA">
                      <option value="MIPA">MIPA</option>
                      <option value="IPS">IPS</option>
                    </select>
                 </div>

                 {/* INPUT ROMBEL */}
                 <div>
                    <label className={labelStyle}>Rombel / Grup</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">#</span>
                      <input 
                        type="text" 
                        name="rombel" 
                        placeholder="1, 2, A, B..." 
                        className={`${inputStyle} pl-8`} 
                        required 
                      />
                    </div>
                 </div>

               </div>
             </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70">
                {mutation.isPending ? "Menyimpan..." : <><HiCheck size={20} /> Simpan Data</>}
              </button>
            </div>
            
          </div>
        </form>
      )}

      {activeTab === "import" && (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">1. Download Template V2</h3>
                <p className="text-sm text-gray-500 mb-4">Format baru (Tanpa NIK, dengan Rombel).</p>
                <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 font-bold text-sm">
                    <HiArrowDownTray size={18} /> Download Excel
                </button>
              </div>
              <div className="bg-white dark:bg-[#1a202c] rounded-xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center text-center hover:border-blue-500 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <HiOutlineCloudArrowUp size={32} className="text-blue-500 mb-2"/>
                 <h3 className="font-bold text-gray-800 dark:text-white">{excelFile ? excelFile.name : "Upload Excel Disini"}</h3>
                 <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                 {excelFile && <button onClick={(e) => {e.stopPropagation(); setExcelFile(null); setPreviewData([])}} className="mt-2 text-red-500 text-xs font-bold hover:underline">Hapus</button>}
              </div>
            </div>
            {/* Bagian Preview Data Excel (Sama, tapi pastikan map field sesuai logika baru) */}
             <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 h-full p-6 flex flex-col items-center justify-center text-gray-400">
                    {previewData.length > 0 ? (
                       <div className="w-full">
                          <p className="text-left font-bold text-gray-800 mb-4">Preview ({previewData.length} data)</p>
                          <div className="overflow-x-auto border rounded-lg">
                             <table className="w-full text-xs text-left">
                                <thead className="bg-gray-50"><tr>{Object.keys(previewData[0]).map(k=><th key={k} className="px-2 py-2">{k}</th>)}</tr></thead>
                                <tbody>{previewData.map((row,i)=><tr key={i} className="border-t"> {Object.values(row).map((v:any,j)=><td key={j} className="px-2 py-2">{v}</td>)} </tr>)}</tbody>
                             </table>
                          </div>
                          <button onClick={handleImportSubmit} disabled={isProcessing} className="mt-4 w-full bg-blue-950 text-white py-2 rounded-lg font-bold hover:bg-blue-900">{isProcessing ? "Importing..." : "Import Sekarang"}</button>
                       </div>
                    ) : (
                       <>
                         <HiTableCells size={48} className="opacity-20 mb-2" />
                         <p>Preview data akan muncul di sini.</p>
                       </>
                    )}
                </div>
            </div>
         </div>
      )}
    </div>
  );
}