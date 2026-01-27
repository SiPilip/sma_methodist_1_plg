"use client";

import React, { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Container } from "../container";
import { HiArrowLongRight } from "react-icons/hi2";

const Hero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const carouselItems = [
    {
      title: "Membangun Generasi Unggul",
      content:
        "Menjadi lembaga pendidikan Kristen yang unggul dalam menghasilkan lulusan beriman teguh, berpengetahuan luas, dan siap melayani.",
    },
    {
      title: "Pendidikan Holistik & Beriman",
      content:
        "Mengintegrasikan nilai-nilai Kristiani dalam setiap aspek pembelajaran untuk mengembangkan potensi siswa secara utuh.",
    },
    {
      title: "Berkarakter, Cerdas & Berintegritas",
      content:
        "Kami berkomitmen mendidik generasi penerus yang cerdas secara akademis dan kuat dalam karakter serta iman.",
    },
  ];

  const handleDotClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section
      className="relative h-[90vh] min-h-[600px] w-full overflow-hidden font-sans"
      aria-label="Selamat Datang di SMA Methodist 1 Palembang"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/hero_drone.mp4" type="video/mp4" />
      </video>

      {/* Minimalist Overlay - Uniform Darkening for Clarity */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center">
        <Container>
          <Carousel
            setApi={setApi}
            className="w-full max-w-4xl mx-auto text-center"
            plugins={[
              Autoplay({
                delay: 6000,
                stopOnInteraction: false,
              }),
            ]}
          >
            <CarouselContent>
              {carouselItems.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center gap-6 px-4 py-8 animate-fade-in-up">
                    <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                      {item.title}
                    </h1>
                    <p className="max-w-2xl text-lg font-medium leading-relaxed text-white/90 md:text-xl">
                      {item.content}
                    </p>
                    <div className="pt-4">
                        <button className="flex items-center gap-3 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all border border-white/30 rounded-full hover:bg-white hover:text-black hover:border-white group">
                            Selengkapnya
                            <HiArrowLongRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </Container>
      </div>

      {/* Minimalist Controls - Bottom Center */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center gap-3">
        {carouselItems.map((_, index) => (
            <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-500 rounded-full h-1.5 ${
                current === index + 1 
                ? "w-12 bg-white" 
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            />
        ))}
      </div>
    </section>
  );
};

export default Hero;
