import Berita from "@/components/home/berita";
import Hero from "@/components/home/hero";
import TentangKami from "@/components/home/tentang_kami";

export default function Home() {
  return (
    <>
      <Hero />
      <TentangKami />
      <Berita />
      <div className="bg-white my-20">Footer</div>
    </>
  );
}
