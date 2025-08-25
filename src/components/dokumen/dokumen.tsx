import { HiArrowLeft, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Container } from "../container";
import Link from "next/link";
import { HiCloudDownload, HiDocumentDownload } from "react-icons/hi";

export default function Dokumen() {
  const headerStyle =
    "bg-blue-950 w-full text-left font-semibold py-2 px-4 text-white";
  const bodyStyle =
    "bg-[#DFEBF7] dark:bg-[#7184BF] w-full text-left py-2 px-4 text-black dark:text-white";
  return (
    <section className="dark:bg-[#495A87] bg-[#F1F2F4] transisi">
      <Container className="py-10">
        <div></div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-12 gap-3">
            <div className={`${headerStyle} col-span-1 !text-center`}>No</div>
            <div className={`${headerStyle} col-span-3`}>Judul Dokumen</div>
            <div className={`${headerStyle} col-span-4`}>Deskripsi</div>
            <div className={`${headerStyle} col-span-2`}>Tanggal Unggah</div>
            <div className={`${headerStyle} col-span-2`}>Link</div>
          </div>
          <div className="flex flex-col gap-2">
            {dataDummy.map((item, index) => (
              <div className="grid grid-cols-12 gap-3" key={index}>
                <div className={`${bodyStyle} col-span-1 !text-center`}>
                  {index + 1}
                </div>
                <div className={`${bodyStyle} col-span-3`}>{item.title}</div>
                <div className={`${bodyStyle} col-span-4`}>
                  {item.deskripsi}
                </div>
                <div className={`${bodyStyle} col-span-2`}>
                  {item.tanggal_unggah}
                </div>
                <div className={`${bodyStyle} col-span-2`}>
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
          <div className="rounded-full bg-white dark:bg-blue-950 dark:text-white border-[2px] border-gray-300 flex gap-8 px-10 py-2 items-center">
            <HiChevronLeft className="stroke-2" />
            <button className="text-[#F86302] cursor-pointer">1</button>
            <button>2</button>
            <button>3</button>
            <span>...</span>
            <span>10</span>
            <HiChevronRight className="stroke-2" />
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
