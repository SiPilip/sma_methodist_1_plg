import Image from "next/image";
import { Container } from "../container";

export default function TentangKami() {
  return (
    <section className="bg-blue-50">
      <Container className="flex flex-col md:flex-row justify-between items-center py-24 gap-10">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl font-bold bg-sky-950 rounded-full w-fit text-white py-3 px-10 mx-auto md:mx-0">
            Tentang Kami
          </h2>
          <p className="mt-10 text-gray-600 leading-relaxed">
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
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-96 overflow-hidden rounded-2xl">
            <Image
              src="/img/tentang-kami.png"
              alt="Gedung Sekolah SMA Methodist 1 Palembang"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
