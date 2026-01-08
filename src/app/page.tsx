import Berita from "@/components/home/berita";
import CardHome from "@/components/home/card-home";
import Hero from "@/components/home/hero";
import TentangKami from "@/components/home/tentang_kami";

export default function Home() {
  return (
    <>
      <Hero />
      <CardHome />
      <TentangKami />
      <Berita />
    </>
  );
}
