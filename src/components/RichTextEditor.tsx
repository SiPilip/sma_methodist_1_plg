"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import style editor

// Load ReactQuill hanya di sisi Client (Browser)
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-40 bg-gray-50 animate-pulse rounded-lg border"></div> 
});

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet",
  "link",
];

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  return (
    <div className="rich-text-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Tulis konten berita di sini..."}
        className="bg-white dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white"
      />
      {/* Custom CSS agar tampilan editor rapi di mode gelap/terang */}
      <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: #f8fafc;
          border-color: #e2e8f0 !important;
        }
        .dark .ql-toolbar {
          background-color: #1e293b;
          border-color: #334155 !important;
        }
        .dark .ql-stroke { stroke: #cbd5e1 !important; }
        .dark .ql-fill { fill: #cbd5e1 !important; }
        
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
        .ql-editor { min-height: 200px; }
      `}</style>
    </div>
  );
}