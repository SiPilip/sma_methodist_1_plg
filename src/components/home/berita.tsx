"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Container } from "../container";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { HiArrowRight } from "react-icons/hi2";

const dummyImage = "/img/berita_dummy.png";

const fetchNews = async () => {
  const res = await fetch("/api/berita?status=Published&limit=3");
  const json = await res.json();
  return json.data || [];
};

// TERIMA PROPS initialData DI SINI
export default function Berita({ initialData }: { initialData?: any[] }) {
  const { data: news, isLoading } = useQuery({
    queryKey: ["public-news"],
    queryFn: fetchNews,
    initialData: initialData, // <--- PASANG DI SINI
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="py-16 dark:bg-[#495A87]" aria-labelledby="berita-sekolah">
      <Container>
        <div className="flex justify-between items-center mb-6">
           <h2 id="berita-sekolah" className="text-2xl font-bold text-gray-800 dark:text-white">
             Berita Sekolah
           </h2>
           <Link href="/berita" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
             Lihat Semua <HiArrowRight/>
           </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {isLoading && !news && [1, 2, 3].map((i) => (
             <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-[350px] animate-pulse"></div>
          ))}

          {!isLoading && news?.map((item: any) => (
             <Link href={`/berita/${item.slug}`} key={item._id} className="group h-full">
               <Card className="overflow-hidden group shadow-none hover:shadow-md hover:-translate-y-1 transition-all duration-300 dark:bg-[#2E3853] lg:rounded-3xl hover:cursor-pointer h-full border border-gray-100 dark:border-white/10 flex flex-col">
                 <div className="bg-gray-100 w-full relative h-48 overflow-hidden shrink-0">
                   <Image
                     src={item.thumbnail || dummyImage}
                     fill
                     className="object-cover absolute group-hover:scale-105 transition-all duration-300"
                     alt={item.judul}
                   />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                 </div>

                 <CardHeader className="flex flex-col gap-2 pb-2 pt-4 px-5">
                   <div className="flex justify-between items-start">
                      <Badge className="dark:bg-[#7184BF] dark:text-white bg-[#F86302] hover:bg-[#F86302]/80 text-[10px] px-2 py-0.5">
                        {item.kategori}
                      </Badge>
                   </div>
                   <h3 className="lg:text-base text-sm line-clamp-2 font-bold leading-tight group-hover:text-blue-600 transition-colors h-[2.5rem]">
                     {item.judul.toUpperCase()}
                   </h3>
                 </CardHeader>

                 <CardContent className="px-5 pb-5">
                   <div 
                      className="lg:text-sm text-xs text-gray-500 dark:text-white line-clamp-3 h-[3.6rem]"
                      dangerouslySetInnerHTML={{ __html: item.konten }} 
                   />
                 </CardContent>
               </Card>
             </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}