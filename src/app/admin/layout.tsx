// FILE: src/app/admin/layout.tsx
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";
import "@/app/globals.css"; // Pastikan import CSS global agar styling jalan


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // KITA TAMBAHKAN HTML & BODY DISINI
    <div className="flex min-h-screen">
      {/* 1. Sidebar (Fixed Left) */}
      <AdminSidebar />
      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
        {children}
        </main>
      </div>
    </div>
  );
}