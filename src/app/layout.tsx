import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/navbar";
import "./globals.css";
import NavbarTop from "@/components/navbar_top";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased bg-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <NavbarTop />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
