import Image from "next/image";
import { Container } from "../container";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import imgdummy from "@/../public/img/berita_dummy.png";

export default function Berita() {
  return (
    <Container className="py-10">
      <h1 className="text-2xl">Berita</h1>

      <div className="grid grid-cols-3 gap-5 mt-5">
        <Card className="overflow-hidden">
          <div className="bg-red-100 w-full relative h-32">
            <Image
              src={imgdummy}
              fill
              className="object-cover absolute"
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Aw</CardHeader>
        </Card>
        <Card>
          <CardHeader>Aw</CardHeader>
        </Card>
      </div>
    </Container>
  );
}
