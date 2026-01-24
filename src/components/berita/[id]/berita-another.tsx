import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function BeritaAnother({ newsList }: { newsList: any[] }) {
  if (!newsList || newsList.length === 0) return null;

  return (
    <div>
      <p className="font-bold text-blue-950 dark:text-white text-xl mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-orange-500 rounded-full block"></span>
        Berita Lainnya
      </p>
      
      <div className="flex flex-col gap-4">
        {newsList.map((item) => (
          <Link
            key={item._id}
            href={`/berita/${item.slug}`}
            className="group grid grid-cols-5 gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/5"
          >
            {/* Thumbnail Kecil */}
            <div className="col-span-2 relative h-24 w-full rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={item.thumbnail || "/img/bg-hero-page.png"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                alt={item.judul}
              />
            </div>
            
            {/* Judul & Tanggal */}
            <div className="col-span-3 flex flex-col justify-between py-1">
              <div>
                <p className="text-sm font-bold leading-snug text-gray-800 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.judul}
                </p>
                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                   {item.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy", { locale: id }) : "-"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}