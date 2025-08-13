import Image from "next/image";
import { Container } from "../container";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import imgdummy from "@/../public/img/berita_dummy.png";

export default function Berita() {
  return (
    <section
      className="py-16 dark:bg-[#495A87] "
      aria-labelledby="berita-sekolah"
    >
      <Container>
        <h2 id="berita-sekolah" className="text-2xl font-bold">
          Berita Sekolah
        </h2>

        <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3 ">
          <Card className="overflow-hidden group shadow-none hover:shadow-md hover:-translate-y-1 transition-all duration-300 dark:bg-[#2E3853] lg:rounded-3xl hover:cursor-pointer">
            <div className="bg-red-100 w-full relative h-52 overflow-hidden">
              <Image
                src={imgdummy}
                fill
                className="object-cover absolute group-hover:scale-105 transition-all duration-300 group-hover:rounded-lg"
                alt="Siswa SMA Methodist 1 Palembang memenangkan lomba desain poster"
              />
              <div className="absolute inset-0 bg-black/0  group-hover:bg-black/50 flex items-center justify-center transition-all duration-300">
                <p className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Baca Selengkapnya
                </p>
              </div>
            </div>
            <CardHeader className="flex flex-col gap-2">
              <Badge className="dark:bg-[#7184BF] dark:text-white bg-[#F86302]">
                Prestasi
              </Badge>
              <h3 className="lg:text-lg line-clamp-2 leading-5 lg:leading-6 font-bold">
                JUARA 1 LOMBA DESAIN POSTER TINGKAT PROVINSI SUMATERA SELATAN
              </h3>
            </CardHeader>
            <CardContent>
              <p className="lg:text-sm text-xs text-gray-500 -mt-4 dark:text-white line-clamp-3">
                Siswa kami kembali mengukir prestasi gemilang dengan meraih
                Juara 1 dalam Lomba Desain Poster tingkat Provinsi Sumatera
                Selatan. Karya inovatif dan pesan kuat yang diusung berhasil
                memukau para juri.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
