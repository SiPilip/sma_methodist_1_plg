"use client";

import { useState } from "react";
import { Container } from "../container";
import { HiOutlineBookOpen, HiOutlineHeart, HiOutlineSparkles } from "react-icons/hi2";
import { IoBodyOutline } from "react-icons/io5";

type FocusType = "akal" | "rohani" | "jasmani" | null;

export default function Filosofi() {
  const [activeWait, setActiveWait] = useState<FocusType>(null);
  const [activeClick, setActiveClick] = useState<FocusType>("akal");

  const active = activeWait || activeClick;

  const handleHover = (val: FocusType) => setActiveWait(val);
  const handleClick = (val: FocusType) => setActiveClick(val);

  const content = {
    akal: {
      title: "Dominus Scientiarum",
      subtitle: "Akal Budi & Pengetahuan",
      desc: "Kami berdedikasi melahirkan generasi cerdas yang kritis, inovatif, dan berwawasan luas. Kurikulum kami dirancang untuk menantang intelektual siswa, mendorong rasa ingin tahu, dan membekali mereka dengan kompetensi masa depan.",
      icon: <HiOutlineBookOpen className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />,
      accent: "border-blue-500 shadow-blue-500/10",
      textAccent: "text-blue-600"
    },
    rohani: {
      title: "Garam & Terang",
      subtitle: "Rohani & Karakter Ilahi",
      desc: "Pendidikan karakter Kristen yang kokoh adalah fondasi kami. Kami menanamkan nilai-nilai kasih, integritas, dan pelayanan, membentuk siswa yang tidak hanya pintar, tetapi juga takut akan Tuhan dan berdampak bagi sesama.",
      icon: <HiOutlineHeart className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />,
      accent: "border-indigo-500 shadow-indigo-500/10",
      textAccent: "text-indigo-600"
    },
    jasmani: {
      title: "Mens Sana in Corpore Sano",
      subtitle: "Jasmani & Kesehatan",
      desc: "Keseimbangan fisik adalah kunci keberhasilan belajar. Kami memfasilitasi pengembangan bakat olahraga dan gaya hidup sehat, memastikan siswa memiliki tubuh yang bugar dan mentalitas juara yang tangguh.",
      icon: <IoBodyOutline className="w-8 h-8 md:w-10 md:h-10 text-sky-600" />,
      accent: "border-sky-500 shadow-sky-500/10",
      textAccent: "text-sky-600"
    },
  };

  const getActiveContent = () => {
    if (active === "akal") return content.akal;
    if (active === "rohani") return content.rohani;
    if (active === "jasmani") return content.jasmani;
    return content.akal; 
  };

  const activeData = getActiveContent();

  return (
    <section className="relative py-24 overflow-hidden bg-slate-50 dark:bg-[#1e293b]" aria-labelledby="filosofi-pendidikan">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-[#1e293b]"></div>
      
      <Container className="relative z-10">
        <div className="flex flex-col items-center justify-center gap-12 lg:flex-row lg:gap-24">
          
          {/* LEFT COLUMN: CONSTELLATION SVG */}
          <div className="w-full md:w-[90%] md:max-w-[450px] aspect-[5/4] md:aspect-square relative flex items-center justify-center">
             
             {/* Center Glow Effect */}
             <div className={`absolute w-64 h-64 rounded-full blur-[80px] transition-all duration-700 opacity-40 mix-blend-multiply dark:mix-blend-screen
                 ${active === 'akal' ? 'bg-blue-300' : active === 'rohani' ? 'bg-indigo-300' : 'bg-sky-300'}
             `}></div>

             <svg viewBox="0 0 460 360" className="w-full h-full drop-shadow-lg">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Connection Lines (Circuit Style) */}
                <path d="M 230 130 L 230 40" stroke="currentColor" className="text-blue-500 dark:text-gray-200" strokeWidth="3" />
                <path d="M 230 130 L 50 260" stroke="currentColor" className="text-blue-500 dark:text-gray-200" strokeWidth="3" />
                <path d="M 230 130 L 410 260" stroke="currentColor" className="text-blue-500 dark:text-gray-200" strokeWidth="3" />

                {/* 1. AKAL (TOP) */}
                <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => handleHover("akal")}
                    onClick={() => handleClick("akal")}
                >
                    {/* Hover Area (Invisible) */}
                    <circle cx="230" cy="40" r="50" fill="transparent" />
                    
                    {/* Node */}
                    <circle cx="230" cy="40" r="24" 
                        className={`transition-all duration-300 stroke-[3px] ${active === 'akal' ? 'fill-blue-500 stroke-blue-200' : 'fill-white stroke-gray-300 dark:fill-gray-800 dark:stroke-gray-600 group-hover:stroke-blue-400'}`}
                    />
                    {/* Pulse Ring */}
                    {active === 'akal' && (
                        <circle cx="230" cy="40" r="32" className="animate-ping fill-none stroke-blue-400 opacity-20" />
                    )}
                    
                    <foreignObject x="218" y="28" width="24" height="24" className="pointer-events-none">
                        <HiOutlineBookOpen className={`w-full h-full ${active === 'akal' ? 'text-white' : 'text-gray-400'}`} />
                    </foreignObject>
                    
                    <text x="230" y="10" textAnchor="middle" className={`text-xs font-bold tracking-[0.2em] transition-colors ${active === 'akal' ? 'fill-blue-600' : 'fill-gray-400'}`}>AKAL BUDI</text>
                </g>

                {/* 2. ROHANI (LEFT) */}
                <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => handleHover("rohani")}
                     onClick={() => handleClick("rohani")}
                >
                    <circle cx="50" cy="260" r="50" fill="transparent" />
                    <circle cx="50" cy="260" r="24" 
                         className={`transition-all duration-300 stroke-[3px] ${active === 'rohani' ? 'fill-indigo-500 stroke-indigo-200' : 'fill-white stroke-gray-300 dark:fill-gray-800 dark:stroke-gray-600 group-hover:stroke-indigo-400'}`}
                    />
                     {active === 'rohani' && (
                        <circle cx="50" cy="260" r="32" className="animate-ping fill-none stroke-indigo-400 opacity-20" />
                    )}
                     <foreignObject x="38" y="248" width="24" height="24" className="pointer-events-none">
                        <HiOutlineHeart className={`w-full h-full ${active === 'rohani' ? 'text-white' : 'text-gray-400'}`} />
                    </foreignObject>
                    <text x="50" y="300" textAnchor="middle" className={`text-xs font-bold tracking-[0.2em] transition-colors ${active === 'rohani' ? 'fill-indigo-600' : 'fill-gray-400'}`}>ROHANI</text>
                </g>

                {/* 3. JASMANI (RIGHT) */}
                <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => handleHover("jasmani")}
                     onClick={() => handleClick("jasmani")}
                >
                    <circle cx="410" cy="260" r="50" fill="transparent" />
                    <circle cx="410" cy="260" r="24" 
                        className={`transition-all duration-300 stroke-[3px] ${active === 'jasmani' ? 'fill-sky-500 stroke-sky-200' : 'fill-white stroke-gray-300 dark:fill-gray-800 dark:stroke-gray-600 group-hover:stroke-sky-400'}`}
                    />
                    {active === 'jasmani' && (
                        <circle cx="410" cy="260" r="32" className="animate-ping fill-none stroke-sky-400 opacity-20" />
                    )}
                    <foreignObject x="398" y="248" width="24" height="24" className="pointer-events-none">
                        <IoBodyOutline className={`w-full h-full ${active === 'jasmani' ? 'text-white' : 'text-gray-400'}`} />
                    </foreignObject>
                    <text x="410" y="300" textAnchor="middle" className={`text-xs font-bold tracking-[0.2em] transition-colors ${active === 'jasmani' ? 'fill-sky-600' : 'fill-gray-400'}`}>JASMANI</text>
                </g>

                {/* Central Core Connection */}
                <circle cx="230" cy="130" r="6" className="fill-blue-500 dark:fill-slate-700" />
                 {/* Animated Lines to Active Node */}
                 <line x1="230" y1="130" x2={active === 'akal' ? 230 : active === 'rohani' ? 50 : 410} y2={active === 'akal' ? 40 : 260} 
                    className={`stroke-[3px] transition-all duration-300 ${activeData.textAccent.replace('text', 'stroke')}`}
                    strokeDasharray="4 2"
                 />
             </svg>
          </div>

          {/* RIGHT COLUMN: CONTENT DISPLAY */}
          <div className="w-full lg:w-1/2 min-h-[320px] flex items-center">
             <div className="relative w-full">
                {/* Transition Container */}
                <div key={active || 'default'} className="animate-fade-in-up">
                    <div className={`p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-800 border transition-all duration-500 relative overflow-hidden group hover:shadow-2xl ${activeData.accent}`}>
                        
                        {/* Decorative Background Icon */}
                        <div className={`absolute -bottom-6 -right-6 opacity-5 rotate-12 transform scale-[3] transition-colors duration-500 ${activeData.textAccent}`}>
                           {activeData.icon}
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-wider uppercase bg-slate-50 dark:bg-slate-700 rounded-full border border-slate-100 dark:border-slate-600 ${activeData.textAccent}`}>
                                    <HiOutlineSparkles /> Filosofi Pendidikan
                                </div>
                                <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-700 ${activeData.textAccent}`}>
                                    {activeData.icon}
                                </div>
                            </div>
                            
                            <h3 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl tracking-tight">
                                {activeData.title}
                            </h3>
                            <p className={`mb-6 text-lg font-medium ${activeData.textAccent} opacity-90`}>
                                {activeData.subtitle}
                            </p>
                            
                            <div className="h-px w-16 bg-gradient-to-r from-slate-200 to-transparent mb-6 dark:from-slate-700"></div>
                            
                            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 text-justify">
                                {activeData.desc}
                            </p>
                        </div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
