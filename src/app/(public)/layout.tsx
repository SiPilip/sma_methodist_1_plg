import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/navbar";
import "./../globals.css";
import NavbarTop from "@/components/navbar_top";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "SMA METHODIST 1 PALEMBANG",
  description:
    "Website resmi SMA Methodist 1 Palembang. Sekolah Kristen terakreditasi A dengan fasilitas lengkap dan tenaga pengajar profesional.",
  keywords:
    "SMA Methodist 1, Methodist 1 Palembang, Sekolah Kristen Palembang, Pendidikan Palembang, Sekolah Terbaik Palembang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <NavbarTop />
      <Navbar />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
