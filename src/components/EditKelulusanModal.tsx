"use client";

import { useState } from "react";
import { HiXMark, HiCheck, HiDocumentArrowUp } from "react-icons/hi2";
import toast from "react-hot-toast";

type Props = {
  data: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditKelulusanModal({ data, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    // Convert switch "on" to "true"
    formData.set("isPublished", formData.get("isPublished") === "on" ? "true" : "false");

    try {
      const res = await fetch(`/api/kelulusan/admin/${data._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal update data");
      
      toast.success("Data berhasil disimpan!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Update Data Kelulusan</h3>
            <p className="text-xs text-gray-500">{data.nama} - {data.nisn}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><HiXMark/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Status Kelulusan */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status Kelulusan</label>
            <select name="status" defaultValue={data.status} className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500">
              <option value="Pending">Pending (Belum ditentukan)</option>
              <option value="Lulus">LULUS</option>
              <option value="Tidak Lulus">TIDAK LULUS</option>
              <option value="Ditunda">DITUNDA</option>
            </select>
          </div>

          {/* Nilai Rata-rata */}
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nilai Rata-Rata (Opsional)</label>
             <input type="text" name="nilaiRataRata" defaultValue={data.nilaiRataRata} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700" placeholder="Contoh: 85.50" />
          </div>

          {/* Upload SKL */}
          <div className="p-4 border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl">
             <label className="block text-xs font-bold text-blue-600 uppercase mb-2">Upload Scan SKL (PDF/Gambar)</label>
             <input type="file" name="fileSkl" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
             {data.fileSklUrl && <p className="text-xs text-green-600 mt-2">✓ File sudah ada (Upload lagi untuk mengganti)</p>}
          </div>

          {/* Catatan */}
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan Sekolah (Opsional)</label>
             <textarea name="catatan" rows={2} defaultValue={data.catatan} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700" placeholder="Pesan untuk siswa..."></textarea>
          </div>

          {/* Approve Switch */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl border">
             <span className="text-sm font-bold">Terbitkan Data Ini?</span>
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" name="isPublished" defaultChecked={data.isPublished} className="sr-only peer" />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
             </label>
          </div>

          {/* Tombol Simpan */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-3 bg-blue-950 text-white font-bold rounded-xl shadow-lg hover:bg-blue-900 disabled:opacity-70 flex justify-center items-center gap-2"
          >
             {isLoading ? "Menyimpan..." : <><HiCheck/> Simpan Perubahan</>}
          </button>

        </form>
      </div>
    </div>
  );
}