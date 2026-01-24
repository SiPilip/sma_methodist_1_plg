"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiUserCircle, HiKey, HiCheck, HiShieldCheck } from "react-icons/hi2";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  // State Form
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState(""); // Readonly
  const [role, setRole] = useState("");         // Readonly
  
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // 1. Fetch Data Awal
  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      if (json.user) {
        setNama(json.user.nama);
        setUsername(json.user.username);
        setRole(json.user.role);
      }
    };
    fetchMe();
  }, []);

  // 2. Mutation Update
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      toast.success("Profil berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: ["me"] }); // Refresh data di navbar
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" }); // Reset form pass
      router.refresh();
    },
    onError: (err: any) => toast.error(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Password Match
    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Konfirmasi password baru tidak cocok!");
    }

    mutation.mutate({
      nama,
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow">
            <HiUserCircle size={40}/>
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan Akun</h1>
            <p className="text-sm text-gray-500">Kelola informasi pribadi dan keamanan Anda.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* KARTU 1: INFO UMUM */}
        <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border shadow-sm space-y-5 h-fit">
            <h3 className="font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200 border-b pb-3">
               <HiUserCircle className="text-blue-500"/> Informasi Dasar
            </h3>

            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Username (Tidak dapat diubah)</label>
               <input type="text" value={username} disabled className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed border-transparent" />
            </div>

            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Peran (Role)</label>
               <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                  {role}
               </span>
            </div>

            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nama Lengkap</label>
               <input 
                 type="text" 
                 required
                 value={nama} 
                 onChange={(e) => setNama(e.target.value)}
                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800" 
               />
            </div>
        </div>

        {/* KARTU 2: KEAMANAN (PASSWORD) */}
        <div className="bg-white dark:bg-[#1a202c] p-6 rounded-2xl border shadow-sm space-y-5 h-fit">
            <h3 className="font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200 border-b pb-3">
               <HiKey className="text-orange-500"/> Ganti Password
            </h3>
            
            <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg text-xs text-orange-700 mb-4">
               Kosongkan jika tidak ingin mengubah password.
            </div>

            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password Baru</label>
               <input 
                 type="password" 
                 value={passwords.newPassword}
                 onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800" 
                 placeholder="Minimal 6 karakter"
               />
            </div>

            <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Konfirmasi Password Baru</label>
               <input 
                 type="password" 
                 value={passwords.confirmPassword}
                 onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                 className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800" 
                 placeholder="Ulangi password baru"
               />
            </div>

            <div className="pt-4 border-t mt-4">
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password Lama (Verifikasi)</label>
               <input 
                 type="password" 
                 required={!!passwords.newPassword} // Wajib jika password baru diisi
                 value={passwords.currentPassword}
                 onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none dark:bg-gray-800" 
                 placeholder="Masukkan password saat ini..."
               />
            </div>
        </div>

        {/* TOMBOL SAVE */}
        <div className="md:col-span-2 flex justify-end">
           <button 
              type="submit" 
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
           >
              {mutation.isPending ? "Menyimpan..." : <><HiCheck size={20}/> Simpan Perubahan</>}
           </button>
        </div>

      </form>
    </div>
  );
}