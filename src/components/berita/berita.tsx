"use client";

import Image from "next/image";
import { Container } from "../container";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const newsCategory = ["semua", "kegiatan", "prestasi", "pengumuman", "lomba"];

export default function BeritaList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const [searchValue, setSearchValue] = useState(search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== search) {
        router.push(`?search=${searchValue}`);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchValue, search, router]);

  return (
    <Container className="py-10">
      <section className="flex flex-col gap-5 mb-5">
        <Input
          placeholder="Cari disini..."
          className="text-xs lg:text-sm"
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.target.value)
          }
        />
        <div className="flex gap-1 flex-wrap">
          {newsCategory.map((item, index) => (
            <Badge
              key={"badge-search-" + index}
              className={cn(
                "px-2 py-1 rounded-xs capitalize bg-transparent border-[1px] border-blue-950 text-blue-950 cursor-pointer lg:text-sm text-xs transisi hover:bg-blue-950 hover:text-white",
                item === category && "bg-blue-950 text-white"
              )}
              onClick={() => router.push(`?category=${item}`)}
            >
              {item}
            </Badge>
          ))}
        </div>
      </section>

      {dummyNews.map((item, index) => (
        <div
          className="flex flex-row items-center py-5 lg:px-10 gap-5 hover:bg-gray-200 transisi cursor-pointer"
          key={"berita " + index}
        >
          <div className="relative lg:w-3/12 w-6/12 lg:h-52 h-32 overflow-hidden bg-amber-600">
            <Image
              src="/img/tentang-kami.png"
              alt="Gedung Sekolah SMA Methodist 1 Palembang"
              fill
              className="object-cover group-hover:scale-105 transition-all duration-300 "
            />
          </div>
          <div className="lg:w-9/12 w-6/12">
            <p className="lg:text-sm text-xs text-gray-500">{item.date}</p>
            <h3 className="lg:text-xl text-base font-semibold">{item.title}</h3>
            <Badge className="lg:my-1 rounded-xs lg:text-xs text-[0.5rem] bg-blue-950">
              {item.category}
            </Badge>
            <p className="lg:text-sm text-xs line-clamp-4">{item.content}</p>
          </div>
        </div>
      ))}
    </Container>
  );
}

const dummyNews = [
  {
    title: "Berita 1",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue eros eu turpis hendrerit aliquam. Phasellus eu ornare turpis, id feugiat neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce bibendum placerat orci nec luctus. Etiam interdum vestibulum nisi, eu aliquet erat accumsan ac. Nunc sed vestibulum sem, et tempor ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et augue lectus. Curabitur pulvinar, nulla eu pulvinar pellentesque, leo mi malesuada mi, ac rhoncus dolor risus sit amet nulla. Fusce non tellus tortor. Cras viverra massa sed felis eleifend mollis. Nulla sit amet lorem ut sem rhoncus finibus sit amet eu dui. Proin accumsan vehicula felis varius bibendum. Nulla facilisi.",
    date: "14 Agustus 2025",
    category: "Kegiatan",
  },
  {
    title: "Berita 2",
    content:
      "Aenean eu quam nec lorem cursus maximus in non erat. Morbi aliquet tellus et ante placerat, eu condimentum velit consectetur. Quisque sagittis egestas porta. Vestibulum posuere neque a convallis semper. Aliquam erat volutpat. Quisque a dictum quam. Nam sit amet augue sollicitudin, porttitor tortor non, ultricies ligula. Ut consequat id eros ac auctor. Mauris odio ex, condimentum quis interdum volutpat, tristique aliquet eros. Cras tempus erat risus, at vestibulum libero suscipit a",
    date: "14 Agustus 2025",
    category: "Prestasi",
  },
  {
    title: "Berita 3",
    content:
      "Aenean at aliquet erat, vitae convallis urna. Cras egestas nec risus nec hendrerit. Vestibulum nisl eros, tincidunt id mi non, pulvinar varius tellus. Quisque sodales massa at augue porttitor hendrerit. Morbi sit amet metus convallis, congue nulla sed, euismod velit. Suspendisse interdum massa dui, quis aliquet nunc semper vitae. In at ultrices leo, nec mattis magna. Suspendisse luctus commodo eros, in vehicula diam cursus quis. Nam ornare velit sed magna porta elementum. Vivamus aliquet orci eros. Pellentesque pulvinar massa justo, volutpat rhoncus diam tincidunt id. Nulla id magna vel lorem ultrices pulvinar non ac quam.",
    date: "14 Agustus 2025",
    category: "Pengumuman",
  },
];
