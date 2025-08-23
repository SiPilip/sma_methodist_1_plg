"use client";

import { Container } from "@/components/container";
import Image from "next/image";
import BgHero from "@/../public/img/bg-hero-page.png";
import Link from "next/link";

import Head from "next/head";
import BeritaShare from "./berita-share";

export default function BeritaContent() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const title = "KEGIATAN FIELD TRIP KELAS IX MENGUNJUNGI MUSEUM SCIENCE";
  const description =
    "Lorem ipsum dolor sit amet consectetur. Nisl purus leo eu augue. Orci viverra facilisi etiam id pretium eu quis.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={BgHero.src} />
        <meta property="og:url" content={shareUrl} />
      </Head>

      <section className="dark:bg-[#495A87] transisi">
        <Container className="py-10">
          <div className="relative h-44 xl:h-96 lg:h-80 w-full mb-5">
            <Image
              src={BgHero}
              fill
              className="object-cover absolute object-bottom"
              alt="bg-hero"
            />
          </div>

          <BeritaShare />

          <div className="lg:grid lg:grid-cols-5 gap-10">
            <p className="lg:col-span-3">
              Lorem ipsum dolor sit amet consectetur. Nisl purus leo eu augue.
              Orci viverra facilisi etiam id pretium eu quis. Vulputate erat sed
              quis congue hendrerit lectus orci molestie ut. Purus in venenatis
              et eu egestas et et ante pellentesque. Id dignissim tempus viverra
              habitasse eget congue risus. Ultrices luctus tincidunt laoreet sed
              est nulla suspendisse. Nulla amet dictum fusce justo suspendisse
              vitae auctor vestibulum nec. Sit scelerisque gravida et neque
              blandit consectetur faucibus. Dolor tincidunt morbi sit iaculis
              sodales faucibus. Bibendum sit odio ullamcorper elit dignissim.
              Lectus porttitor morbi sociis vulputate mi nulla. Pellentesque
              cursus ut auctor nec aliquam enim facilisis in sapien. Elementum
              fermentum orci consequat nullam diam. Convallis praesent ornare
              lectus viverra. Quis mi nulla aliquet scelerisque nulla urna
              turpis aenean. Habitasse fermentum faucibus diam vitae risus
              placerat nunc arcu. Nisi vulputate pretium tristique at non.
              Fermentum quam vitae ac ullamcorper molestie neque. Pharetra
              elementum auctor malesuada senectus ultricies. Donec interdum arcu
              in quis ut. Leo mauris sit quisque imperdiet duis vitae mi.
              Facilisi sit eget volutpat rutrum sed facilisis at purus.
              Sollicitudin praesent eu dignissim amet elementum mauris ultrices
              phasellus maecenas. At accumsan commodo porta senectus tellus at
              accumsan lorem. Quam vitae massa aliquet curabitur posuere leo
              nunc donec. Tellus lorem donec tellus interdum malesuada.
              Facilisis vulputate et vulputate metus. Semper diam et amet nibh.
              Velit ac porttitor eu aenean posuere est diam scelerisque. Quis
              non arcu lectus nisl nulla porttitor felis senectus. Risus lectus
              purus mattis ut enim risus egestas eu. Nec non nulla nunc morbi eu
              tristique. Ut facilisis quis duis massa duis molestie nisl.
              Quisque habitant sit elit tempor tempus in molestie dictum enim.
              Risus venenatis ornare ultrices ultrices consequat interdum nisi
              augue. Tortor suspendisse est feugiat suspendisse commodo nulla
              sed. Molestie tempus mi id sapien tempor faucibus vitae. Cum
              porttitor consectetur sit proin ut diam in venenatis ultrices. In
              nibh cras tempus sed metus ut purus pretium eleifend. Orci
              ultricies id neque nisl quis id vitae tincidunt. Mi vivamus a
              turpis aenean. Tristique lobortis eget tristique a consequat.
            </p>
            <div className="lg:col-span-2 lg:mt-0 mt-5">
              <h3 className="font-semibold text-blue-950 dark:text-white text-xl mb-2">
                Berita Lainnya
              </h3>
              <Link
                className="grid grid-cols-5 gap-3 hover:bg-blue-950/20 transisi p-3 rounded-md"
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
                  <h2 className="text-base font-semibold leading-5 mb-2">
                    KEGIATAN FIELD TRIP KELAS IX MENGUNJUNGI MUSEUM SCIENCE
                  </h2>
                  <hr className="mb-2 dark:border-blue-900" />
                  <p className="line-clamp-4 text-xs">
                    Lorem ipsum dolor sit amet consectetur. Nisl purus leo eu
                    augue. Orci viverra facilisi etiam id pretium eu quis.
                    Vulputate erat sed quis congue hendrerit lectus orci
                    molestie ut. Purus in venenatis et eu egestas et et ante
                    pellentesque. Id dignissim tempus viverra habitasse
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
