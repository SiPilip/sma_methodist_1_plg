"use client";

import { useQuery } from "@tanstack/react-query";
import { HiTrophy, HiUser, HiUsers } from "react-icons/hi2";
import { IoIosSchool } from "react-icons/io";
import { Container } from "../container";

const fetchStats = async () => {
  const res = await fetch("/api/public/home");
  const json = await res.json();
  return json.data;
};

// TERIMA PROPS initialData DI SINI
export default function CardHome({ initialData }: { initialData?: any }) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["public-stats"],
    queryFn: fetchStats,
    initialData: initialData, // <--- PASANG DI SINI
    staleTime: 1000 * 60 * 5, // Data dianggap segar 5 menit
  });

  const cards = [
    { title: "Pengajar", value: stats?.guru || 0, icon: <HiUser /> },
    { title: "Siswa", value: stats?.siswa || 0, icon: <HiUsers /> },
    { title: "Alumni", value: stats?.alumni || 0, icon: <IoIosSchool /> },
    { title: "Prestasi", value: stats?.prestasi || 0, icon: <HiTrophy /> },
  ];

  return (
    <section className="bg-white shadow-2xl relative z-20 -mt-10 mx-4 md:mx-0 rounded-xl md:rounded-none">
      <Container className="grid grid-cols-1 w-fit md:w-full md:grid-cols-2 lg:grid-cols-4 gap-5 py-10">
        {cards.map((card, idx) => (
          <div key={idx} className="flex flex-row gap-5 items-center md:justify-center">
            <div className="md:text-5xl text-4xl rounded-full bg-blue-950 md:p-5 p-5 text-white shrink-0">
              {/* Cek isLoading DAN !stats agar tidak flicker kalau data server ada */}
              {isLoading && !stats ? <div className="animate-pulse bg-white/20 rounded-full w-12 h-12"/> : card.icon}
            </div>
            <div className="text-xl">
              <p className="font-semibold text-3xl">
                 {isLoading && !stats ? "..." : card.value}
              </p>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}