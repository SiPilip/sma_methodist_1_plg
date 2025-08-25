import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Container } from "../container";
import Link from "next/link";
import { HiCloudDownload } from "react-icons/hi";

export default function Dokumen() {
  const headerStyle =
    "bg-blue-950 w-full text-left lg:font-semibold font-medium lg:py-2 lg:px-4 px-1 py-2 text-white lg:text-base text-xs  flex items-center";
  const bodyStyle =
    "bg-[#DFEBF7] dark:bg-[#7184BF] w-full text-left lg:py-2 lg:px-4 p-1 text-black dark:text-white text-wrap lg:text-base text-xs flex items-center";
  return (
    <section className="dark:bg-[#495A87] bg-[#F1F2F4] transisi">
      <Container className="py-10">
        <div></div>
        <div className="flex flex-col gap-2">
          <div className="grid lg:grid-cols-12 grid-cols-9 lg:gap-3 gap-1">
            <div
              className={`${headerStyle} lg:col-span-1 col-span-1 justify-center`}
            >
              No
            </div>
            <div className={`${headerStyle} lg:col-span-3 col-span-2`}>
              Judul Dokumen
            </div>
            <div className={`${headerStyle} lg:col-span-4 col-span-2`}>
              Deskripsi
            </div>
            <div className={`${headerStyle} lg:col-span-2 col-span-2`}>
              Tanggal Unggah
            </div>
            <div className={`${headerStyle} lg:col-span-2 col-span-2`}>
              Link
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {dataDummy.map((item, index) => (
              <div
                className="grid lg:grid-cols-12 grid-cols-9 lg:gap-3 gap-1"
                key={index}
              >
                <div
                  className={`${bodyStyle} lg:col-span-1  col-span-1 justify-center`}
                >
                  {index + 1}
                </div>
                <div className={`${bodyStyle} lg:col-span-3 col-span-2`}>
                  {item.title}
                </div>
                <div className={`${bodyStyle} lg:col-span-4 col-span-2`}>
                  {item.deskripsi}
                </div>
                <div className={`${bodyStyle} lg:col-span-2 col-span-2`}>
                  {item.tanggal_unggah}
                </div>
                <div className={`${bodyStyle} lg:col-span-2 col-span-2`}>
                  <Link
                    href={item.url}
                    className="flex gap-2 items-center underline underline-offset-3"
                  >
                    <HiCloudDownload />
                    Unduh
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <div className="rounded-full bg-white dark:bg-blue-950 dark:text-white border-[2px] border-gray-300 flex lg:gap-8 lg:px-10 px-5 lg:py-2 py-1 items-center gap-4 text-sm lg:text-base">
            <HiChevronLeft className="lg:stroke-2 stroke-1" />
            <button className="text-[#F86302] cursor-pointer">1</button>
            <button>2</button>
            <button>3</button>
            <span>...</span>
            <span>10</span>
            <HiChevronRight className="lg:stroke-2 stroke-1" />
          </div>
        </div>
      </Container>
    </section>
  );
}

const dataDummy = [
  {
    title: "Dokumen Sekolah",
    deskripsi: "Dokumen Sekolah",
    tanggal_unggah: "2025-01-01",
    url: "/dokumen/dokumen-1",
  },
  {
    title: "Dokumen Sekolah",
    deskripsi: "Dokumen Sekolah",
    tanggal_unggah: "2025-01-01",
    url: "/dokumen/dokumen-1",
  },
  {
    title: "Dokumen Sekolah",
    deskripsi: "Dokumen Sekolah",
    tanggal_unggah: "2025-01-01",
    url: "/dokumen/dokumen-1",
  },
  {
    title: "Dokumen Sekolah",
    deskripsi: "Dokumen Sekolah",
    tanggal_unggah: "2025-01-01",
    url: "/dokumen/dokumen-1",
  },
];
