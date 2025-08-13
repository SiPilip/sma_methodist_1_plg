"use client";

import Image from "next/image";
import { Container } from "../container";
import bgBatik from "@/../public/img/bg-batik.png";

export default function TentangKami() {
  return (
    <section className="bg-blue-50 dark:bg-[#2E3853] group relative overflow-hidden">
      <Image
        src={bgBatik}
        className="absolute left-0 top-0 h-full w-full object-cover opacity-50 dark:opacity-30 animate-kenburns"
        alt="footer-bg"
      />
      <Container className="flex flex-col md:flex-row justify-between items-center py-24 gap-10">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="lg:text-2xl text-base lg:font-semibold font-medium bg-sky-950 dark:bg-[#7184BF] rounded-full w-fit text-white py-3 px-10 mx-auto md:mx-0">
            Tentang Kami
          </h2>
          <p className="mt-10 text-gray-600 lg:text-base text-sm leading-relaxed dark:text-white">
            SMA Methodist 1 Palembang adalah institusi pendidikan yang
            berdedikasi untuk menciptakan generasi unggul secara akademis dan
            berkarakter. Kami menyediakan lingkungan belajar yang inspiratif
            dengan kurikulum komprehensif yang menyeimbangkan akademis,
            keterampilan hidup, kepemimpinan, dan kreativitas. Didukung oleh
            tenaga pendidik profesional dan fasilitas memadai, kami fokus pada
            pengembangan potensi setiap siswa secara menyeluruh. Kami percaya
            pada kemitraan yang erat antara sekolah, siswa, dan orang tua untuk
            membangun masa depan yang cerah. Bergabunglah dengan komunitas
            pembelajar kami yang dinamis dan berprestasi.
          </p>
        </div>
        <div className="w-full md:w-1/2 ">
          <div className="relative w-full lg:h-96 aspect-square lg:aspect-auto overflow-hidden rounded-2xl group-hover:inset-shadow-sm">
            <Image
              src="/img/tentang-kami.png"
              alt="Gedung Sekolah SMA Methodist 1 Palembang"
              fill
              className="object-cover group-hover:scale-105 transition-all duration-300 "
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
