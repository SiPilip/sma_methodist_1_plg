import Image from "next/image";
import BgHero from "@/../public/img/bg-hero-page.png";
import { Container } from "../../container";
import { Badge } from "../../ui/badge";
import { HiClock } from "react-icons/hi2";

export default function HeroBeritaPage({ title }: { title: string }) {
  return (
    <div className="min-h-44 lg:min-h-80 relative w-full ">
      <Image
        src={BgHero}
        fill
        className="object-cover absolute object-bottom"
        alt="bg-hero"
      />
      <div className="absolute inset-0 bg-[#2E3853]/60 bg-opacity-50 flex flex-col items-center justify-center text-white">
        <Container className="flex flex-col gap-5 lg:my-10">
          <Badge className="lg:text-xl bg-[#F86302] dark:bg-[#7184BF] transisi font-semibold rounded-full px-5 lg:px-8 -mb-2 py-1 dark:text-white">
            Kegiatan Siswa
          </Badge>
          <h1 className="uppercase lg:text-3xl xl:text-4xl text-xl xl:leading-14 lg:leading-11 leading-6 font-bold transisi">
            {title}
          </h1>
          <p className="flex gap-2 items-center text-xs lg:text-lg xl:text-xl -mt-3">
            <HiClock />
            <span className="font-medium">12 Desember 2024</span>
          </p>
        </Container>
      </div>
    </div>
  );
}
