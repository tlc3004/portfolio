import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { GiRobotGolem } from "react-icons/gi";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./chatbot/config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";
import { useSound } from "./custom/useSound";

export default function App() {
  const [selectedSidebar, setSelectedSidebar] = useState("INDICE");
  const [selectedNavbar, setSelectedNavbar] = useState("PERFIL");
  const [lastSelectedFrom, setLastSelectedFrom] = useState("sidebar");
  const [bioSections, setBioSections] = useState({});
  const [cvSections, setCvSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const beepSound = "/sounds/click-button.mp3";
  const playBeep = useSound(beepSound);

  // Cargar bio.txt
  useEffect(() => {
    fetch("/data/bio.txt")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseBioText(text);
        setBioSections(parsed);
        setLoading(false);
      });
  }, []);

  // Cargar cv.json
  useEffect(() => {
    fetch("/data/cv.json")
      .then((res) => res.json())
      .then((json) => {
        setCvSections(json);
      });
  }, []);

  const parseBioText = (text) => {
    const lines = text.split("\n");
    const result = {};
    let currentKey = "";

    lines.forEach((line) => {
      if (line.startsWith("###")) {
        currentKey = line.replace("###", "").trim();
        result[currentKey] = "";
      } else if (currentKey) {
        result[currentKey] += line + "\n";
      }
    });

    return result;
  };

  useEffect(() => {
    if (selectedSidebar) setLastSelectedFrom("sidebar");
  }, [selectedSidebar]);

  useEffect(() => {
    if (selectedNavbar) setLastSelectedFrom("navbar");
  }, [selectedNavbar]);

  return (
    <div className="flex">
      <Sidebar onSelect={setSelectedSidebar} />
      <div className="flex-1 ml-16">
        <Navbar onSelect={setSelectedNavbar} />

        <main className="p-8 pt-24 text-gray-800">
          {loading ? (
            <p>Cargando contenido...</p>
          ) : lastSelectedFrom === "sidebar" ? (
            <section className="prose max-w-3xl bg-cyan-50 p-4 rounded shadow">
              <h2 className="text-xl font-bold text-cyan-800">{selectedSidebar}</h2>
              <pre className="whitespace-pre-wrap">
                {bioSections[selectedSidebar] || "Sección no encontrada."}
              </pre>
            </section>
          ) : selectedNavbar === "MI_SUSHI" ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cvSections["MI_SUSHI"]?.map((foto, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={foto.imagen}
                    alt={foto.descripcion || foto.nombre}
                    className="w-full h-60 object-cover transform transition duration-300 hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{foto.nombre}</h3>
                    {foto.descripcion && (
                      <p className="text-sm text-gray-600">{foto.descripcion}</p>
                    )}
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <section className="prose max-w-3xl bg-white p-4 rounded shadow border">
              <h2 className="text-xl font-bold text-gray-700">
                {selectedNavbar.replaceAll("_", " ")}
              </h2>
              <pre className="whitespace-pre-wrap">
                {formatCVContent(cvSections[selectedNavbar]) || "Sección no encontrada."}
              </pre>
            </section>
          )}
        </main>

        {/* Chatbot flotante en la esquina inferior derecha */}
        <div className="fixed bottom-1 right-10 z-50">
          <button
            onClick={() => {
              playBeep();
              setShowChatbot((prev) => !prev);
            }}
            className="bg-blue-800 hover:bg-cyan-700 text-white p-4 rounded-full shadow-lg transition"
            title="¿Necesitas ayuda?"
          >
            <GiRobotGolem className="text-2xl" />
          </button>

          {showChatbot && (
            <div className="relative w-[280px] h-[500px] rounded-lg shadow-2xl overflow-hidden border border-gray-300 bg-white">
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Formatear el contenido del cv.json como texto legible
  function formatCVContent(content) {
    if (!content) return null;

    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
      return content
        .map((item) =>
          typeof item === "string" ? `• ${item}` : `• ${item.nombre || JSON.stringify(item)}`
        )
        .join("\n\n");
    }

    if (typeof content === "object") {
      return Object.entries(content)
        .map(([key, val]) => {
          if (Array.isArray(val)) {
            return `🔹 ${key}:\n${val.map((v) => `   - ${v}`).join("\n")}`;
          } else if (typeof val === "object") {
            return `🔸 ${key}:\n${Object.entries(val)
              .map(([k2, v2]) => {
                if (Array.isArray(v2)) {
                  return `   ▪ ${k2}:\n${v2.map((vv) => `     - ${vv}`).join("\n")}`;
                } else {
                  return `   ▪ ${k2}: ${v2}`;
                }
              })
              .join("\n")}`;
          } else {
            return `🔸 ${key}: ${val}`;
          }
        })
        .join("\n\n");
    }

    return String(content);
  }
}
