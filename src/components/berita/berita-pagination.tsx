"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/pagination"; // Import komponen Anda

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function BeritaPagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fungsi ini dipanggil saat user klik angka/next/prev di komponen Pagination Anda
  const handlePageChange = (page: number) => {
    // 1. Ambil params URL saat ini (misal: ?kategori=Prestasi)
    const params = new URLSearchParams(searchParams.toString());
    
    // 2. Set halaman baru
    params.set("page", page.toString());

    // 3. Pindah halaman (Server akan merender ulang data baru)
    router.push(`/berita?${params.toString()}`);
  };

  // Jika halaman cuma 1, sembunyikan pagination (Optional, tapi komponen Anda sudah handle ini di dalam)
  if (totalPages <= 1) return null;

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}