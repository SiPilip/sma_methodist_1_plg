"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiPlus, HiTrash, HiPencil, HiShieldCheck, HiUser } from "react-icons/hi2";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// Komponen Modal Tambah/Edit (Inline biar ringkas)
const UserModal = ({ isOpen, onClose, onSubmit, initialData }: any) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-6 animate-in zoom-in duration-200">
        <h3 className="text-xl font-bold mb-4">{initialData ? "Edit User" : "Tambah User Baru"}</h3>
        <form onSubmit={(e: any) => {
           e.preventDefault();
           const formData = new FormData(e.target);
           const data : any= Object.fromEntries(formData);
           // Handle checkbox isActive
           data.isActive = formData.get("isActive") === "on" ? true : false; 
           onSubmit(data);
        }}>
           <div className="space-y-4">
              <div>
                 <label className="text-xs font-bold uppercase text-gray-500">Nama Lengkap</label>
                 <input name="nama" defaultValue={initialData?.nama} required className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                 <label className="text-xs font-bold uppercase text-gray-500">Username</label>
                 <input name="username" defaultValue={initialData?.username} disabled={!!initialData} required className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 disabled:opacity-50" />
              </div>
              <div>
                 <label className="text-xs font-bold uppercase text-gray-500">Role</label>
                 <select name="role" defaultValue={initialData?.role || "Editor"} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <option value="SuperAdmin">SuperAdmin (Full Akses)</option>
                    <option value="Editor">Editor (Guru/Staff)</option>
                    <option value="Osis">Osis (Berita Only)</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs font-bold uppercase text-gray-500">Password {initialData && "(Kosongkan jika tidak diganti)"}</label>
                 <input type="password" name="password" required={!initialData} className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="******" />
              </div>
              
              {initialData && (
                 <div className="flex items-center gap-2">
                    <input type="checkbox" name="isActive" defaultChecked={initialData.isActive} className="w-5 h-5" />
                    <span className="text-sm">Akun Aktif?</span>
                 </div>
              )}
           </div>
           
           <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Batal</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Simpan</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Fetch Users
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
       const res = await fetch("/api/users");
       const json = await res.json();
       return json.data || [];
    }
  });

  // Mutation Create/Update
  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      const url = editData ? `/api/users/${editData._id}` : "/api/users";
      const method = editData ? "PUT" : "POST";
      
      const res = await fetch(url, {
         method,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      toast.success(editData ? "User diupdate" : "User dibuat");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setEditData(null);
    },
    onError: (err: any) => toast.error(err.message)
  });

  // Mutation Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
    },
    onSuccess: () => {
      toast.success("User dihapus");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  return (
    <div className="space-y-6">
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditData(null); }} 
        onSubmit={(data: any) => mutation.mutate(data)}
        initialData={editData}
      />

      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen User</h1>
            <p className="text-sm text-gray-500">Kelola akses Admin, Guru, dan OSIS.</p>
         </div>
         <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700">
            <HiPlus size={20}/> Tambah User
         </button>
      </div>

      <div className="bg-white dark:bg-[#1a202c] rounded-xl border shadow-sm overflow-hidden">
         <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b uppercase text-xs text-gray-500">
               <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y">
               {isLoading ? <tr><td colSpan={4} className="p-8 text-center">Loading...</td></tr> : 
                users?.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                     <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                           <HiUser size={20}/>
                        </div>
                        <div>
                           <p className="font-bold text-gray-800 dark:text-white">{user.nama}</p>
                           <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                           user.role === 'SuperAdmin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                           user.role === 'Osis' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                           'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                           {user.role}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                        {user.isActive ? 
                           <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><HiShieldCheck/> Aktif</span> : 
                           <span className="text-red-500 text-xs font-bold">Non-Aktif</span>
                        }
                     </td>
                     <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => { setEditData(user); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><HiPencil/></button>
                        <button onClick={() => {
                           Swal.fire({
                             title: 'Hapus User?', text: "Tidak bisa dikembalikan!", icon: 'warning', showCancelButton: true, confirmButtonText: 'Hapus'
                           }).then((res) => { if(res.isConfirmed) deleteMutation.mutate(user._id); });
                        }} className="p-2 text-red-600 hover:bg-red-50 rounded"><HiTrash/></button>
                     </td>
                  </tr>
                ))
               }
            </tbody>
         </table>
      </div>
    </div>
  );
}