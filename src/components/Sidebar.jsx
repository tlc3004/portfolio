import { useState } from "react";
import { useSound } from "../custom/useSound";
import { FaHome, FaProjectDiagram, FaUser, FaEnvelope } from "react-icons/fa";


export default function Sidebar({ onSelect }) {
  const playBeep = useSound("/sounds/button.mp3");
  const [isHovered, setIsHovered] = useState(false);

  const links = [
    { icon: <FaHome />, label: "INDICE" },
    { icon: <FaProjectDiagram />, label: "CURRICULUM" },
    { icon: <FaUser />, label: "SOBRE MÍ" },
    { icon: <FaEnvelope />, label: "DATOS PERSONALES" }
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-gradient-to-b from-cyan-900 to-cyan-600 text-white h-screen py-6 px-2 transition-all duration-300 shadow-lg
    ${isHovered ? "w-50" : "w-16"} overflow-hidden fixed z-20`}
    >
      <nav className="flex flex-col gap-6 mt-10">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => {
              playBeep();
              onSelect(link.label);
            }}
            className="flex items-center gap-4 hover:text-yellow-300 transition-colors px-4 py-2 text-xs md:text-sm font-bold tracking-wide text-gray-700   px-3 py-1 rounded-lg transition-all duration-100 ease-in-out shadow-sm hover:shadow-md"
          >
            <span className="text-2xl">{link.icon}</span>
            <span
              className={`whitespace-nowrap text-sm font-medium transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {link.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
