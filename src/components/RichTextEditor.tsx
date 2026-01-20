"use client";

import { useMemo, useRef } from "react"; // Tambah useRef & useMemo
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css"; 

// Import tipe ReactQuill untuk Ref
import ReactQuill from "react-quill-new"; 

// Dynamic Import (SSR False)
const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false, loading: () => <div className="h-40 bg-gray-50 animate-pulse rounded-lg border"></div> }
);

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const quillRef = useRef<ReactQuill>(null);

  // --- CUSTOM IMAGE HANDLER ---
  const imageHandler = () => {
    // 1. Buat element input file secara virtual
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // 2. Saat file dipilih
    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        // Validasi Ukuran (Misal Max 2MB untuk gambar konten)
        if (file.size > 2 * 1024 * 1024) {
          alert("Ukuran gambar terlalu besar (Max 2MB)");
          return;
        }

        // 3. Upload ke API
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/upload/image", {
            method: "POST",
            body: formData,
          });
          
          const data = await res.json();
          
          if (data.url) {
            // 4. Masukkan URL Gambar ke dalam Editor
            const quill = quillRef.current?.getEditor();
            const range = quill?.getSelection();
            if (quill && range) {
                quill.insertEmbed(range.index, "image", data.url);
            }
          } else {
            alert("Gagal upload gambar");
          }
        } catch (error) {
          console.error("Error upload image:", error);
          alert("Terjadi kesalahan saat upload gambar");
        }
      }
    };
  };

  // --- MODULES CONFIGURATION ---
  // Kita gunakan useMemo agar modul tidak di-render ulang terus menerus
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image", "video"], // Tombol Image ada di sini
        ["clean"],
      ],
      handlers: {
        image: imageHandler, // Pasang Custom Handler di sini
      },
    },
  }), []);

  const formats = [
    "header",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "align",
    "link", "image", "video",
  ];

  return (
    <div className="rich-text-container">
      <QuillNoSSRWrapper
        forwardedRef={quillRef} // Pass Ref ke Quill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Tulis konten berita di sini..."}
        className="bg-white dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white"
      />
      
      <style jsx global>{`
        /* Style sama seperti sebelumnya */
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: #f8fafc;
          border-color: #e2e8f0 !important;
        }
        .dark .ql-toolbar {
          background-color: #1e293b;
          border-color: #334155 !important;
          color: #fff;
        }
        .dark .ql-stroke { stroke: #cbd5e1 !important; }
        .dark .ql-fill { fill: #cbd5e1 !important; }
        .dark .ql-picker { color: #cbd5e1 !important; }
        
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #e2e8f0 !important;
          min-height: 200px;
          font-size: 1rem;
        }
        .dark .ql-container {
          border-color: #334155 !important;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 10px 0;
          display: block; /* Agar tidak inline */
        }
      `}</style>
    </div>
  );
}