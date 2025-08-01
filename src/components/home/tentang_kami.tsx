import Image from "next/image";
import { Container } from "../container";

export default function TentangKami() {
  return (
    <section className="bg-blue-50">
      <Container className="flex flex-col md:flex-row justify-between items-center py-24 gap-10">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl font-bold bg-sky-950 rounded-full w-fit text-white py-3 px-10 mx-auto md:mx-0">
            Tentang Kami
          </h1>
          <p className="mt-10">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam, quos.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-96 overflow-hidden rounded-2xl">
            <Image
              src="/img/home-tentang_kami.svg"
              alt="Tentang Kami"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
