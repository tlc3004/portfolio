import { useSound } from "../custom/useSound";

export default function Navbar({ onSelect }) {
  const beepSound = "/sounds/click.mp3";
  const playBeep = useSound(beepSound);

  const links = [
    "PERFIL",
    "MI SUSHI",
    "EXPERIENCIA",
    "PROYECTOS",
    "IMAGENES"
  ];

  return (
    <header className="flex flex-wrap gap-3 bg-white shadow-md border-b border-gray-200 px-6 py-4 fixed top-0 left-16 right-0 z-10">
      {links.map((label, index) => (
        <button
          key={index}
          onClick={() => {
            playBeep();
            onSelect(label);
          }}
          className="text-xs md:text-sm font-bold tracking-wide text-gray-700 hover:text-cyan-500  px-3 py-1 rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
        >
          {label === "MI_SUSHI" ? " MI SUSHI" : label.replaceAll("_", " ")}
        </button>
      ))}
    </header>
  );
}
