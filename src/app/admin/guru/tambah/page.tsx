"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import * as XLSX from "xlsx"; // Import SheetJS
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  HiArrowLeft, HiPhoto, HiOutlineCloudArrowUp, HiCheck,
  HiBriefcase, HiAcademicCap, HiTrash, HiPlus,
  HiUser, HiEnvelope, HiPhone, HiDocumentText, HiTableCells, HiArrowDownTray
} from "react-icons/hi2";
import ImageCropperModal from "@/components/ImageCropperModal"; 

type PendidikanState = {
  jenjang: string;
  instansi: string;
  tahun: string;
};

export default function TambahGuruPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Tabs
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");
  
  // State Manual
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImgSrc, setTempImgSrc] = useState<string | null>(null);
  const [pendidikanList, setPendidikanList] = useState<PendidikanState[]>([
    { jenjang: "S1", instansi: "", tahun: "" }
  ]);

  // State Import Excel
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- LOGIC MANUAL ---
  const addPendidikan = () => setPendidikanList([...pendidikanList, { jenjang: "", instansi: "", tahun: "" }]);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const manualMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await fetch("/api/guru", { method: "POST", body: payload });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => { toast.success("Berhasil menambahkan data!"); router.push("/admin/guru"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = new FormData();

    // Append Text
    ["nama", "nip", "jabatan", "kategori", "mataPelajaran", "email", "noHp", "bio"].forEach(key => {
        payload.append(key, formData.get(key) as string);
    });

    // Append Pendidikan
    const validPendidikan = pendidikanList.filter(p => p.instansi && p.tahun);
    payload.append("pendidikan", JSON.stringify(validPendidikan));

    if (selectedFile) payload.append("foto", selectedFile);

    manualMutation.mutate(payload);
  };

  // --- LOGIC IMPORT EXCEL ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      setPreviewData(XLSX.utils.sheet_to_json(sheet).slice(0, 5));
    };
    reader.readAsBinaryString(file);
    toast.success("File Excel dimuat");
  };

  const downloadTemplate = () => {
    const template = [{
      "Nama_Lengkap": "Budi Santoso, S.Pd",
      "NIP": "198501012010011001",
      "Kategori": "Guru", // atau Karyawan
      "Jabatan": "Guru Mapel",
      "Mapel": "Matematika", // Kosongkan jika karyawan
      "Email": "budi@sekolah.sch.id",
      "NoHP": "081234567890",
      "Bio": "Methodist 1 Palembang goes to the next level!"
    }];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Guru");
    XLSX.writeFile(wb, "Template_Import_Guru.xlsx");
  };

  const handleImportSubmit = async () => {
    if (!previewData.length) return;
    setIsProcessing(true);
    try {
      // Mapping Excel ke Database Schema
      const formattedData = previewData.map((row: any) => ({
        nama: row["Nama_Lengkap"],
        nip: String(row["NIP"]),
        kategori: row["Kategori"],
        jabatan: row["Jabatan"],
        mataPelajaran: row["Mapel"] || "",
        email: row["Email"],
        noHp: String(row["NoHP"]),
        bio: row["Bio"] || "Methodist 1 Palembang goes to the next level!",
        status: true,
        pendidikan: [] // Default kosong dulu untuk import excel biar simpel
      }));

      const res = await fetch("/api/guru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      
      toast.success(result.message);
      router.push("/admin/guru");
    } catch (error: any) {
      toast.error("Gagal Import: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Styles
  const labelStyle = "block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide";
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-950 text-sm transition-all";

  return (
    <div className="space-y-6 pb-10">
      {/* Cropper Modal */}
      {showCropper && tempImgSrc && <ImageCropperModal imageSrc={tempImgSrc} onCancel={() => setShowCropper(false)} onCropComplete={onCropComplete} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/guru" className="p-2.5 rounded-full bg-white dark:bg-white/5 border hover:bg-gray-50 transition-colors">
            <HiArrowLeft size={20} className="text-gray-600 dark:text-gray-200" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Tambah Pengajar / Staf</h1>
            <p className="text-sm text-gray-500">Database Sumber Daya Manusia Sekolah.</p>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex text-sm font-medium">
          <button onClick={() => setActiveTab("manual")} className={`px-4 py-2 rounded-md transition-all ${activeTab === "manual" ? "bg-white shadow-sm text-blue-950" : "text-gray-500"}`}>Input Manual</button>
          <button onClick={() => setActiveTab("import")} className={`px-4 py-2 rounded-md flex items-center gap-2 ${activeTab === "import" ? "bg-white shadow-sm text-blue-950" : "text-gray-500"}`}><HiDocumentText /> Import Excel</button>
        </div>
      </div>

      {/* --- FORM MANUAL --- */}
      {activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#DFEBF7] dark:bg-blue-900/20 p-8 rounded-2xl border flex flex-col items-center text-center">
               <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                  {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-blue-200"><HiPhoto size={64}/></div>}
               </div>
               <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md flex items-center gap-2">
                  <HiOutlineCloudArrowUp size={18} /> Upload Foto
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
               </label>
             </div>

             <div className="bg-white dark:bg-[#1a202c] rounded-xl border p-6">
               <label className={labelStyle}>Tentang Saya (Bio)</label>
               <textarea 
                 name="bio" 
                 rows={6} 
                 className={inputStyle} 
                 defaultValue="Methodist 1 Palembang goes to the next level!" // SARAN 3: Default Value
               ></textarea>
             </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border p-6">
               <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6 border-b pb-4"><HiUser size={20}/> Informasi Pegawai</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                     <label className={labelStyle}>Nama Lengkap & Gelar</label>
                     <input type="text" name="nama" required className={inputStyle} placeholder="Contoh: Oliver Granli, S.Pd." />
                  </div>
                  <div>
                     <label className={labelStyle}>NIP / NUPTK</label>
                     <input type="text" name="nip" required className={`${inputStyle} font-mono`} />
                  </div>
                  <div>
                     <label className={labelStyle}>Kategori</label>
                     <select name="kategori" className={inputStyle} defaultValue="Guru">
                        <option value="Guru">Tenaga Pengajar (Guru)</option>
                        <option value="Karyawan">Staf / Karyawan (TU)</option>
                     </select>
                  </div>
                  
                  {/* SARAN 2: JABATAN DROPDOWN */}
                  <div>
                     <label className={labelStyle}>Jabatan Struktural</label>
                     <select name="jabatan" className={inputStyle} required>
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
                     <label className={labelStyle}>Mata Pelajaran (Opsional)</label>
                     <input type="text" name="mataPelajaran" className={inputStyle} placeholder="Untuk Guru" />
                  </div>
                  <div>
                     <label className={labelStyle}>Email Sekolah</label>
                     <input type="email" name="email" className={inputStyle} />
                  </div>
                  <div>
                     <label className={labelStyle}>No. Handphone</label>
                     <input type="text" name="noHp" className={inputStyle} />
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-[#1a202c] rounded-xl border p-6">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><HiAcademicCap size={20}/> Riwayat Pendidikan</h3>
                  <button type="button" onClick={addPendidikan} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"><HiPlus/> Tambah</button>
               </div>
               <div className="space-y-3">
                 {pendidikanList.map((item, idx) => (
                   <div key={idx} className="flex gap-2">
                      <input type="text" className={`${inputStyle} flex-1/12 text-center`} value={item.jenjang} onChange={(e) => updatePendidikan(idx, "jenjang", e.target.value)} placeholder="S1" list="jenjang-list"/>
                      <input type="text" className={`${inputStyle} flex-8/12`} value={item.instansi} onChange={(e) => updatePendidikan(idx, "instansi", e.target.value)} placeholder="Nama Kampus"/>
                      <input type="number" className={`${inputStyle} flex-1/12 text-center`} value={item.tahun} onChange={(e) => updatePendidikan(idx, "tahun", e.target.value)} placeholder="Thn"/>
                      <button type="button" onClick={() => removePendidikan(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><HiTrash/></button>
                   </div>
                 ))}
                 <datalist id="jenjang-list"><option value="S3"/><option value="S2"/><option value="S1"/><option value="D3"/></datalist>
               </div>
            </div>

            <div className="flex justify-end gap-4">
               <button type="submit" disabled={manualMutation.isPending} className="px-8 py-3 bg-blue-950 text-white font-bold rounded-lg shadow-lg disabled:opacity-70 flex items-center gap-2">
                  {manualMutation.isPending ? "Menyimpan..." : <><HiCheck size={20}/> Simpan Data</>}
               </button>
            </div>
          </div>
        </form>
      )}

      {/* --- FORM IMPORT EXCEL (SARAN 1) --- */}
      {activeTab === "import" && (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-[#1a202c] rounded-xl border p-6">
                <h3 className="font-bold text-gray-800 mb-2">1. Download Template</h3>
                <p className="text-sm text-gray-500 mb-4">Gunakan template resmi untuk import data guru.</p>
                <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg font-bold text-sm hover:bg-green-100">
                    <HiArrowDownTray size={18} /> Download Excel
                </button>
              </div>
              <div className="bg-white dark:bg-[#1a202c] rounded-xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center text-center cursor-pointer hover:border-blue-500" onClick={() => fileInputRef.current?.click()}>
                 <HiOutlineCloudArrowUp size={32} className="text-blue-500 mb-2"/>
                 <h3 className="font-bold text-gray-800">{excelFile ? excelFile.name : "Upload File Excel"}</h3>
                 <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                 {excelFile && <button onClick={(e) => {e.stopPropagation(); setExcelFile(null); setPreviewData([])}} className="mt-2 text-red-500 text-xs font-bold hover:underline">Hapus</button>}
              </div>
            </div>
            
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-[#1a202c] rounded-xl border p-6 min-h-[300px] flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><HiTableCells/> Preview Data</h3>
                    {previewData.length > 0 ? (
                       <div className="flex-1 overflow-x-auto border rounded-lg mb-4">
                          <table className="w-full text-xs text-left">
                             <thead className="bg-gray-50"><tr>{Object.keys(previewData[0]).map(k=><th key={k} className="px-3 py-2 whitespace-nowrap">{k}</th>)}</tr></thead>
                             <tbody>{previewData.map((row,i)=><tr key={i} className="border-t hover:bg-gray-50">{Object.values(row).map((v:any,j)=><td key={j} className="px-3 py-2 whitespace-nowrap">{v}</td>)}</tr>)}</tbody>
                          </table>
                       </div>
                    ) : (
                       <div className="flex-1 flex items-center justify-center text-gray-400 italic">Preview data akan muncul di sini...</div>
                    )}
                    <button onClick={handleImportSubmit} disabled={!excelFile || isProcessing} className="w-full bg-blue-950 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50">
                       {isProcessing ? "Mengimport..." : "Import Semua Data"}
                    </button>
                </div>
            </div>
         </div>
      )}
    </div>
  );
}