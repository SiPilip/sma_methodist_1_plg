"use client";

import Image from "next/image";
import { Container } from "../container";
import bgBatik from "@/../public/img/bg-batik.png";

export default function TentangKami() {
  return (
    <section className="relative overflow-hidden bg-blue-50/50 pt-56 pb-20 dark:bg-[#2E3853] lg:pt-28 lg:pb-32 lg:-mt-16 -mt-52">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={bgBatik}
          className="h-full w-full object-cover opacity-[0.03] dark:opacity-[0.05] animate-kenburns"
          alt="background pattern"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-white/80 dark:via-transparent dark:to-[#2E3853]/80" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          {/* Content Column */}
          <div className="w-full lg:w-1/2">
            <div className="mb-8 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                Tentang Kami
              </span>
              <h2 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
                Membentuk Karakter, <br />
                <span className="text-blue-600 dark:text-blue-400">
                  Meraih Prestasi
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-base leading-relaxed text-gray-600 dark:text-gray-300 lg:text-lg text-justify lg:text-left">
              <p>
                SMA Methodist 1 Palembang adalah institusi pendidikan yang
                berdedikasi untuk menciptakan generasi unggul secara akademis dan
                berkarakter. Kami menyediakan lingkungan belajar yang inspiratif
                dengan kurikulum komprehensif yang menyeimbangkan akademis,
                keterampilan hidup, kepemimpinan, dan kreativitas.
              </p>
              <p>
                Didukung oleh tenaga pendidik profesional dan fasilitas memadai,
                kami fokus pada pengembangan potensi setiap siswa secara
                menyeluruh. Kami percaya pada kemitraan yang erat antara
                sekolah, siswa, dan orang tua untuk membangun masa depan yang
                cerah.
              </p>
            </div>

            <div className="mt-10 text-center lg:text-left">
              <button className="px-8 py-3 text-sm font-semibold text-white transition-all duration-300 bg-blue-900 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-500/25 hover:-translate-y-1">
                Selengkapnya
              </button>
            </div>
          </div>

          {/* Image Column */}
          <div className="w-full lg:w-1/2">
            <div className="relative mx-auto w-full max-w-lg aspect-[4/5] lg:aspect-square group">
              {/* Decorative border frame */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-blue-200 dark:border-blue-800/30 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />

              {/* Main Image Container */}
              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-out transform md:-rotate-2 group-hover:rotate-0 group-hover:shadow-3xl bg-gray-200 dark:bg-gray-700">
                <Image
                  src="/img/tentang-kami.png"
                  alt="Gedung Sekolah SMA Methodist 1 Palembang"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
