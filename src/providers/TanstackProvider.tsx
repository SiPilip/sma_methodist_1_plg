"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast"; // <--- Import ini

export default function TanstackProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Pasang Toaster disini agar aktif di seluruh aplikasi */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            style: {
              background: '#dcfce7', // Hijau lembut
              color: '#166534',
              border: '1px solid #bbf7d0',
              fontWeight: 'light',
            },
          },
          error: {
            style: {
              background: '#fee2e2', // Merah lembut
              color: '#991b1b',
              border: '1px solid #fecaca',
              fontWeight: 'light',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}