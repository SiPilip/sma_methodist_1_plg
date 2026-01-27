import Image from "next/image";
import { Container } from "../container";
import { cn } from "@/lib/utils";
import { HiSparkles, HiFlag, HiCheckCircle } from "react-icons/hi2";

export default function VisiMisi() {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-gray-50 dark:bg-[#495A87]">
      {/* --- BACKGROUND DECORATION (Gen-Z Glow Effect) --- */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <Container className="relative z-10 flex flex-col gap-24">
        
        {/* --- SECTION HEADER --- */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 text-xs font-bold tracking-widest uppercase border border-blue-200 dark:border-blue-800">
            Core Values
          </span>
          <h2 className="text-3xl md:text-5xl mt-5 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-950 to-indigo-600 dark:from-white dark:to-blue-300">
            Visi & Misi Sekolah
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Fondasi utama kami dalam membentuk generasi masa depan yang cerdas, berkarakter, dan beriman.
          </p>
        </div>

        {/* --- CONTENT 1: VISI (Left Image, Right Text) --- */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Image Side (With Decorative Card) */}
          <div className="relative group order-2 lg:order-1">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 opacity-20 scale-95 transition-transform group-hover:rotate-3 duration-500"></div>
            <div className="relative h-[300px] lg:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
              <Image
                src="/img/tentang-kami.png"
                alt="Visualisasi Visi Sekolah"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-5 left-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 shadow-lg">
                <p className="text-xs font-bold text-blue-950 dark:text-white uppercase tracking-wider">
                  Future Ready
                </p>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-300">
                <HiSparkles size={28} />
              </div>
              <h3 className="text-3xl font-bold text-blue-950 dark:text-white">
                Visi Kami
              </h3>
            </div>
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
               <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                &quot;Menjadi sekolah unggulan yang menghasilkan lulusan berkualitas tinggi, berakhlak mulia, berwawasan global, dan siap menghadapi tantangan masa depan dengan mengintegrasikan nilai-nilai Kristiani dalam seluruh aspek pembelajaran.&quot;
               </p>
            </div>
          </div>
        </div>

        {/* --- CONTENT 2: MISI (Right Image, Left Text) --- */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
           {/* Text Side */}
           <div className="space-y-6 order-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-300">
                <HiFlag size={28} />
              </div>
              <h3 className="text-3xl font-bold text-blue-950 dark:text-white">
                Misi Kami
              </h3>
            </div>

            <ul className="space-y-4">
              {[
                "Menyelenggarakan pendidikan berkualitas tinggi dengan standar nasional dan internasional.",
                "Mengembangkan karakter siswa yang berakhlak mulia berdasarkan nilai-nilai Kristiani.",
                "Mempersiapkan siswa dengan keterampilan abad 21 yang relevan dengan kebutuhan global.",
                "Menciptakan lingkungan belajar yang kondusif, inovatif, dan mendukung pengembangan potensi siswa.",
                "Membangun kerjasama dengan berbagai pihak untuk meningkatkan kualitas pendidikan.",
              ].map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5 group"
                >
                  <HiCheckCircle className="mt-1 text-green-500 shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-gray-600 dark:text-gray-300 text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Side */}
          <div className="relative group order-2">
            <div className="absolute inset-0 bg-indigo-600 rounded-2xl -rotate-6 opacity-20 scale-95 transition-transform group-hover:-rotate-3 duration-500"></div>
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
              <Image
                src="/img/tentang-kami.png" // Bisa ganti gambar lain jika ada
                alt="Visualisasi Misi Sekolah"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
               {/* Floating Badge */}
               <div className="absolute top-5 right-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 shadow-lg text-right">
                <p className="text-xs font-bold text-indigo-900 dark:text-white uppercase tracking-wider">
                  Character Building
                </p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}