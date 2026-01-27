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
    { 
        title: "Pengajar", 
        value: stats?.guru || 0, 
        icon: <HiUser className="text-2xl text-blue-600 dark:text-blue-300" />,
        bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    { 
        title: "Siswa", 
        value: stats?.siswa || 0, 
        icon: <HiUsers className="text-2xl text-indigo-600 dark:text-indigo-300" />,
        bg: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    { 
        title: "Alumni", 
        value: stats?.alumni || 0, 
        icon: <IoIosSchool className="text-2xl text-sky-600 dark:text-sky-300" />,
        bg: "bg-sky-50 dark:bg-sky-900/20"
    },
    { 
        title: "Prestasi", 
        value: stats?.prestasi || 0, 
        icon: <HiTrophy className="text-2xl text-amber-600 dark:text-amber-300" />,
        bg: "bg-amber-50 dark:bg-amber-900/20"
    },
  ];

  return (
    <section className="relative z-20 mx-4 -mt-16 md:mx-0 ">
      <Container>
        <div className="p-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl dark:bg-[#495A87] dark:shadow-none border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm md:p-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:divide-x dark:divide-gray-700">
            {cards.map((card, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center gap-3 text-center transition-transform duration-300 group hover:-translate-y-1 md:flex-row md:justify-start md:text-left md:gap-5"
              >
                {/* Icon Box */}
                <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl shrink-0 transition-colors duration-300 ${card.bg}`}>
                  {isLoading && !stats ? (
                    <div className="w-8 h-8 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
                  ) : (
                    <div className="transition-transform duration-300 transform group-hover:scale-110">
                        {card.icon}
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 font-sans md:text-3xl">
                     {isLoading && !stats ? "..." : card.value}
                  </span>
                  <span className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-white md:text-sm">
                    {card.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}