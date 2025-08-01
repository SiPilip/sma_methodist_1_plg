import Image from "next/image";
import { Container } from "../container";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import imgdummy from "@/../public/img/berita_dummy.png";

export default function Berita() {
  return (
    <section className="py-16" aria-labelledby="berita-sekolah">
      <Container>
        <h2 id="berita-sekolah" className="text-2xl font-bold">
          Berita Sekolah
        </h2>

        <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3">
          <Card className="overflow-hidden group shadow-none hover:shadow-sm transition-all duration-300">
            <div className="bg-red-100 w-full relative h-52 overflow-hidden">
              <Image
                src={imgdummy}
                fill
                className="object-cover absolute group-hover:scale-105 transition-all duration-300 group-hover:rounded-lg"
                alt="Siswa SMA Methodist 1 Palembang memenangkan lomba desain poster"
              />
            </div>
            <CardHeader className="flex flex-col gap-2">
              <Badge>Prestasi</Badge>
              <h3 className="text-lg font-bold">
                JUARA 1 LOMBA DESAIN POSTER TINGKAT PROVINSI SUMATERA SELATAN
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 -mt-4">
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
