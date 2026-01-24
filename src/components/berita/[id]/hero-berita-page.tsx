import Image from "next/image";
import BgHero from "@/../public/img/bg-hero-page.png";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { HiClock } from "react-icons/hi2";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface HeroProps {
  title: string;
  category: string;
  date: string | Date;
}

export default function HeroBeritaPage({ title, category, date }: HeroProps) {
  return (
    <div className="min-h-44 lg:min-h-80 relative w-full">
      <Image
        src={BgHero}
        fill
        className="object-cover absolute object-bottom"
        alt="bg-hero"
        priority // Penting untuk LCP (Largest Contentful Paint)
      />
      <div className="absolute inset-0 bg-[#2E3853]/80 flex flex-col items-center justify-center text-white p-4 text-center">
        <Container className="flex flex-col gap-5 lg:my-10 items-center">
          <Badge className="lg:text-xl bg-blue-950 dark:bg-[#7184BF] transisi font-semibold rounded-full px-5 lg:px-8 -mb-2 py-1 dark:text-white border-none shadow-lg">
            {category}
          </Badge>
          <h1 className="uppercase lg:text-3xl xl:text-4xl text-xl xl:leading-normal lg:leading-normal leading-snug font-bold transisi max-w-4xl">
            {title}
          </h1>
          <p className="flex gap-2 items-center text-xs lg:text-lg xl:text-xl -mt-3 opacity-90">
            <HiClock />
            <span className="font-medium">
              {date ? format(new Date(date), "dd MMMM yyyy", { locale: id }) : "-"}
            </span>
          </p>
        </Container>
      </div>
    </div>
  );
}