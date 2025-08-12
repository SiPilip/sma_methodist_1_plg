import { HiMail } from "react-icons/hi";
import { HiPhone } from "react-icons/hi2";

export default function NavbarTop() {
  return (
    <section className="bg-blue-950  text-white w-full  p-2 xl:px-1">
      <div className="container lg:text-xs text-[0.6rem] items-center gap-2 flex justify-start w-full  mx-auto pl-3 lg:pl-0">
        <span className="flex items-center gap-1 no-underline ">
          <HiMail />: sma_methodist_1_plg@gmail.com
        </span>
        <span className="flex items-center gap-1 no-underline">
          <HiPhone />: 0711-28814
        </span>
      </div>
    </section>
  );
}
