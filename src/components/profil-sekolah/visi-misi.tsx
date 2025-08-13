import Image from "next/image";
import { Container } from "../container";
import { cn } from "@/lib/utils";

export default function VisiMisi() {
  return (
    <section
      id="visi-misi"
      className="flex flex-row gap-5 bg-[#DFEBF7] dark:bg-[#495A87] transisi"
    >
      <Container className="flex flex-col  justify-between items-center lg:py-24 py-16 gap-10 lg:gap-20">
        <Content
          title="Visi"
          content="Menjadi sekolah unggulan yang menghasilkan lulusan berkualitas tinggi, berakhlak mulia, berwawasan global, dan siap menghadapi tantangan masa depan dengan mengintegrasikan nilai-nilai Kristiani dalam seluruh aspek pembelajaran."
          variation="left"
          type={null}
        />
        <Content
          title="Misi"
          content={[
            "Menyelenggarakan pendidikan berkualitas tinggi dengan standar nasional dan internasional.",
            "Mengembangkan karakter siswa yang berakhlak mulia berdasarkan nilai-nilai Kristiani.",
            "Mempersiapkan siswa dengan keterampilan abad 21 yang relevan dengan kebutuhan global.",
            "Menciptakan lingkungan belajar yang kondusif, inovatif, dan mendukung pengembangan potensi siswa.",
            "Membangun kerjasama dengan berbagai pihak untuk meningkatkan kualitas pendidikan.",
          ]}
          variation="right"
          type="list"
        />
      </Container>
    </section>
  );
}

function Content({
  title,
  content,
  variation = "left",
  type,
}: {
  title: string;
  content: string | string[];
  type: null | "list";
  variation: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "w-full flex flex-col lg:flex-row gap-10 items-center",
        variation === "right" && "lg:flex-row-reverse"
      )}
    >
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="lg:text-2xl text-base font-semibold  bg-sky-950 transisi dark:bg-[#7184BF] rounded-full w-fit text-white py-3 px-10 mx-auto md:mx-0">
          {title}
        </h2>
        <div className="mt-10 text-gray-600 lg:text-base text-sm leading-relaxed dark:text-white bg-gray-50 dark:bg-[#2E3853] p-5 rounded-md transisi">
          {type === "list" ? (
            <ul className="space-y-3 ">
              {Array.isArray(content)
                ? content.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-sky-950 dark:bg-[#7184BF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))
                : content.split("\n\n").map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-sky-950 dark:bg-[#7184BF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
            </ul>
          ) : typeof content === "string" ? (
            content.split("\n\n").map((paragraph, index) => (
              <p key={index} className={index > 0 ? "mt-4" : ""}>
                {paragraph}
              </p>
            ))
          ) : (
            content.map((paragraph, index) => (
              <p key={index} className={index > 0 ? "mt-4" : ""}>
                {paragraph}
              </p>
            ))
          )}
        </div>
      </div>
      <div className="w-full md:w-1/2 h-full flex items-center">
        <div className="relative w-full lg:h-80 aspect-square lg:aspect-auto overflow-hidden rounded-2xl group-hover:inset-shadow-sm">
          <Image
            src="/img/tentang-kami.png"
            alt="Gedung Sekolah SMA Methodist 1 Palembang"
            fill
            className="object-cover group-hover:scale-105 transition-all duration-300 "
          />
        </div>
      </div>
    </div>
  );
}
