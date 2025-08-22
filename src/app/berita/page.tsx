import BeritaList from "@/components/berita/berita";
import HeroPage from "@/components/hero-page";
import { Suspense } from "react";

export default function Berita() {
  return (
    <Suspense>
      <HeroPage title="Berita" />
      <BeritaList />
    </Suspense>
  );
}
