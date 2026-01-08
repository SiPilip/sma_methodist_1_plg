import { HiTrophy, HiUser, HiUsers } from "react-icons/hi2";
import { Container } from "../container";
import { IoIosSchool } from "react-icons/io";

const cards = [
  { title: "Pengajar", value: 100, icon: <HiUser /> },
  { title: "Siswa", value: 100, icon: <HiUsers /> },
  { title: "Alumni", value: 100, icon: <IoIosSchool /> },
  { title: "Prestasi", value: 100, icon: <HiTrophy /> },
];

export default function CardHome() {
  return (
    <section className="bg-white shadow-2xl">
      <Container className="grid grid-cols-1 w-fit md:w-full md:grid-cols-2 lg:grid-cols-4 gap-5 py-10">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-row gap-5 items-center md:justify-center"
          >
            <div className="md:text-5xl text-4xl rounded-full bg-blue-950 md:p-5 p-5 text-white">
              {card.icon}
            </div>
            <div className="text-xl">
              <p className="font-semibold text-3xl">{card.value}</p>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
