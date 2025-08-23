import Image from "next/image";
import Link from "next/link";
import BgHero from "@/../public/img/bg-hero-page.png";

export default function BeritaAnother() {
  return (
    <div className="lg:col-span-2 lg:mt-0 mt-5">
      <p className="font-semibold text-blue-950 dark:text-white text-xl mb-2">
        Berita Lainnya
      </p>
      <Link
        className="grid grid-cols-5 gap-3 hover:bg-blue-950/10 dark:hover:bg-blue-950/20 transisi p-3 rounded-md"
        href={"/"}
      >
        <div className="col-span-2 relative h-full w-full">
          <Image
            src={BgHero}
            fill
            className="object-cover absolute object-bottom"
            alt="bg-hero"
          />
        </div>
        <div className="col-span-3">
          <p className="text-base font-semibold leading-5 mb-2">
            KEGIATAN FIELD TRIP KELAS IX MENGUNJUNGI MUSEUM SCIENCE
          </p>
          <hr className="mb-2 dark:border-blue-900 border-gray-300" />
          <p className="line-clamp-4 text-xs">
            Lorem ipsum dolor sit amet consectetur. Nisl purus leo eu augue.
            Orci viverra facilisi etiam id pretium eu quis. Vulputate erat sed
            quis congue hendrerit lectus orci molestie ut. Purus in venenatis et
            eu egestas et et ante pellentesque. Id dignissim tempus viverra
            habitasse
          </p>
        </div>
      </Link>
    </div>
  );
}
