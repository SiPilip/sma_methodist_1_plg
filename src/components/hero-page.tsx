import Image from "next/image";
import BgHero from "@/../public/img/bg-hero-page.png";
import { Container } from "./container";

export default function HeroPage({ title }: { title: string }) {
  return (
    <div className="h-44 lg:h-80 relative w-full ">
      <Image
        src={BgHero}
        fill
        className="object-cover absolute object-bottom"
        alt="bg-hero"
      />
      <div className="absolute inset-0 bg-[#2E3853]/60 bg-opacity-50 flex flex-col items-center justify-center text-white font-bold lg:text-6xl text-2xl uppercase lg:pt-30 pt-20">
        <Container>{title}</Container>
      </div>
    </div>
  );
}
