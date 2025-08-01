import Image from "next/image";
import { Container } from "../container";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import imgdummy from "@/../public/img/berita_dummy.png";

export default function Berita() {
  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold">Berita Sekolah</h1>

      <div className="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3">
        <Card className="overflow-hidden group shadow-none hover:shadow-sm transition-all duration-300">
          <div className="bg-red-100 w-full relative h-52 overflow-hidden">
            <Image
              src={imgdummy}
              fill
              className="object-cover absolute group-hover:scale-105 transition-all duration-300 group-hover:rounded-lg"
              alt="dummy"
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
