"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Container } from "../container";
import { Badge } from "../ui/badge";
import { HiArrowRight, HiCalendar } from "react-icons/hi2";

const dummyImage = "/img/berita_dummy.png";

const fetchNews = async () => {
  const res = await fetch("/api/berita?status=Published&limit=3");
  const json = await res.json();
  return json.data || [];
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
}

export default function Berita({ initialData }: { initialData?: any[] }) {
  const { data: news, isLoading } = useQuery({
    queryKey: ["public-news"],
    queryFn: fetchNews,
    initialData: initialData,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="relative py-20 overflow-hidden bg-white dark:bg-[#2E3853]" aria-labelledby="berita-sekolah">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full translate-x-1/2 rounded-full opacity-30 bg-gradient-to-l from-blue-100 to-transparent blur-3xl pointer-events-none dark:from-blue-900/20" />
      <div className="absolute bottom-0 left-0 w-1/3 h-2/3 -translate-x-1/2 rounded-full opacity-30 bg-gradient-to-r from-orange-100 to-transparent blur-3xl pointer-events-none dark:from-orange-900/10" />

      <Container>
        {/* Header Section */}
        <div className="flex flex-col items-center justify-between gap-4 mb-12 md:flex-row">
           <div className="relative text-center md:text-left">
             <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-100 rounded-full blur-xl opacity-70 animate-pulse dark:bg-blue-900/50" />
             <h2 id="berita-sekolah" className="relative z-10 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 dark:from-white dark:to-blue-200 md:text-4xl">
               Kabar Terbaru
             </h2>
             <p className="mt-2 text-sm text-gray-500 font-medium dark:text-gray-400">
               Mengikuti jejak prestasi dan kegiatan sekolah kami
             </p>
           </div>
           
           <Link 
             href="/berita" 
             className="px-6 py-2.5 text-sm font-semibold text-white transition-all bg-blue-600 rounded-full shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center gap-2 group ring-2 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800"
           >
             Lihat Semua Berita 
             <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
           </Link>
        </div>

        {/* CSS for custom staggered animation */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
            opacity: 0;
          }
        `}</style>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && !news && [1, 2, 3].map((i) => (
             <div key={i} className="h-[400px] bg-gradient-to-b from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl animate-pulse shadow-sm border border-gray-100 dark:border-gray-700" />
          ))}

          {!isLoading && news?.map((item: any, idx: number) => (
             <div 
                key={item._id} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${idx * 150}ms` }}
             >
                <Link href={`/berita/${item.slug}`} className="block h-full group">
                  <article className="relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-xl rounded-3xl dark:bg-[#344063] dark:border-gray-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 dark:hover:shadow-none">
                    
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden shrink-0">
                      <Image
                        src={item.thumbnail || dummyImage}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={item.judul}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      {/* Floating Date Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white shadow-lg bg-orange-500/90 backdrop-blur-md rounded-xl">
                            <HiCalendar className="w-3.5 h-3.5" />
                            {item.createdAt ? formatDate(item.createdAt) : "Terbaru"}
                        </div>
                      </div>

                      {/* Category Badge overlay at bottom */}
                       <div className="absolute bottom-4 left-4">
                            <Badge className="px-3 py-1 text-xs font-bold text-white border-0 shadow-lg bg-blue-600/90 hover:bg-blue-700 backdrop-blur-md">
                                {item.kategori}
                            </Badge>
                       </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-grow p-6">
                      <h3 className="mb-3 text-xl font-bold leading-snug text-gray-800 transition-colors line-clamp-2 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
                        {item.judul}
                      </h3>
                      
                      <div 
                          className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-300 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: item.konten }} 
                       />

                       {/* Footer / Read More */}
                       <div className="mt-auto pt-4 border-t border-gray-50 dark:border-white/10 flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group/link">
                          Baca Selengkapnya
                          <HiArrowRight className="w-4 h-4 ml-1 transition-transform transform group-hover/link:translate-x-1" />
                       </div>
                    </div>
                  </article>
                </Link>
             </div>
          ))}
        </div>
      </Container>
    </section>
  );
}