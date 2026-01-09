import React, { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // 1. HELPER RANGE
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  // 2. LOGIKA DOTS (useMemo harus dijalankan SELALU)
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    // Case 1: Halaman sedikit (misal kurang dari 6), tampilkan semua
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: Dots hanya di KANAN
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "...", totalPages];
    }

    // Case 3: Dots hanya di KIRI
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "...", ...rightRange];
    }

    // Case 4: Dots di KEDUA SISI
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  }, [totalPages, currentPage, siblingCount]);

  // 3. EARLY RETURN (Pindahkan ke sini, SETELAH hooks)
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8 select-none">
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        &lt;
      </button>

      {/* Render Angka dan Dots */}
      {paginationRange.map((pageNumber, index) => {
        // Render Dots (...)
        if (pageNumber === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="w-10 h-10 flex items-center justify-center text-gray-400 font-medium"
            >
              &#8230;
            </span>
          );
        }

        // Render Angka
        return (
          <button
            key={index} // Gunakan index sebagai key jika angka bisa duplikat (jarang terjadi di sini, tapi aman)
            onClick={() => onPageChange(pageNumber as number)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg shadow font-medium transition-all duration-300 ${
              currentPage === pageNumber
                ? "bg-blue-950 text-white transform scale-105 -translate-y-0.5"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        &gt;
      </button>
    </div>
  );
}
