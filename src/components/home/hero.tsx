"use client";

import React, { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "../container";

const Hero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const carouselItems = [
    {
      title: "Visi",
      content:
        "Menjadi lembaga pendidikan Kristen yang unggul dalam menghasilkan lulusan beriman teguh, berpengetahuan luas, dan siap melayani masyarakat dengan kasih dan integritas.",
    },
    {
      title: "Misi",
      content:
        "Menyelenggarakan pendidikan berkualitas yang mengintegrasikan nilai-nilai Kristiani, mengembangkan potensi siswa secara holistik, serta menumbuhkan semangat kepedulian sosial dan kepemimpinan.",
    },
    {
      title: "Kata Sambutan",
      content:
        "Dengan sukacita kami menyambut Anda di SMA Methodist 1 Palembang. Kami berkomitmen untuk mendidik generasi penerus yang tidak hanya cerdas secara akademis, tetapi juga kuat dalam karakter dan iman. Mari bergabung bersama kami.",
    },
  ];

  const handleDotClick = useCallback(
    (index: number) => {
      if (!api) {
        return;
      }
      api.scrollTo(index);
    },
    [api]
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section
      className="relative h-[80vh] w-full overflow-hidden"
      aria-label="Selamat Datang di SMA Methodist 1 Palembang"
    >
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
        aria-label="Video drone pemandangan sekolah SMA Methodist 1 Palembang"
      >
        <source src="/videos/hero_drone.mp4" type="video/mp4" />
        Browser Anda tidak mendukung tag video.
      </video>
      <div className="absolute inset-0 bg-[#2E3853]/60 bg-opacity-50 flex flex-col items-center justify-center">
        <Container>
          <Carousel
            setApi={setApi}
            className="w-full"
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
              }),
            ]}
            aria-roledescription="carousel"
            aria-label="Visi, Misi, dan Kata Sambutan"
          >
            <CarouselContent>
              {carouselItems.map((item, index) => (
                <CarouselItem key={index} aria-roledescription="slide">
                  <div className="p-1 text-white">
                    <h2 className="text-3xl lg:text-5xl font-semibold">
                      {item.title}
                    </h2>
                    <p className="mt-2 lg:text-xl max-w-4xl">{item.content}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-start w-full mt-32">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  current === index + 1 ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
