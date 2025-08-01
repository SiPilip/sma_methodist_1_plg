import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { HiMail, HiPhone } from "react-icons/hi";

export default function Footer() {
  return (
    <div className="bg-blue-950 py-10 text-white">
      <Container>
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex gap-6">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/img/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="filter invert"
              />
            </Link>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/img/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="filter invert"
              />
            </Link>
            <Link
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/img/youtube.svg"
                alt="YouTube"
                width={24}
                height={24}
                className="filter invert"
              />
            </Link>
          </div>

          <p className="font-medium">
            Jl. Jend. Sudirman No.KM 3,5, Pahlawan, Kec. Kemuning, Kota
            Palembang, Sumatera Selatan 30126
          </p>

          <div className="flex flex-row gap-2 items-center">
            <p className="flex items-center gap-2">
              <HiPhone />
              <span>(0711)313861</span>
            </p>
            <p className="flex items-center gap-2">
              <HiMail />
              <span>sma.methodist1@yahoo.com</span>
            </p>
          </div>

          <div className="flex -space-x-2">
            <Image
              src="/img/logo.svg"
              alt="Logo Sekolah"
              width={80}
              height={80}
            />
            <div className="flex flex-col place-items-start text-md -space-y-1 text-white">
              <span className="font-semibold">SMA METHODIST 1</span>
              <span>PALEMBANG</span>
            </div>
          </div>

          <div className="border-t border-gray-700 w-full "></div>

          <div className="text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} SMA Methodist 1 Palembang. All
              Rights Reserved.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
