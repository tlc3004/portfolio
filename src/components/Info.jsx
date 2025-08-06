import { useEffect, useState } from "react";

export default function Info({ sectionName }) {
  const [text, setText] = useState("PERFIL");
  const [rawJson, setRawJson] = useState(null); // <- soporte para datos estructurados

  useEffect(() => {
    if (!sectionName) return;

    fetch("/data/cv.json")
      .then((res) => res.json())
      .then((json) => {
        setRawJson(json); // <- guardamos el JSON completo

        const keys = Object.keys(json);
        const key = keys.find(
          (k) => k.toUpperCase() === sectionName.toUpperCase()
        );

        if (!key) return setText("Sección no encontrada.");

        const content = json[key];
        let formatted = "";

        // Si es string simple
        if (typeof content === "string") {
          formatted = content;
        }

        // Si es array (como lista de logros o proyectos)
        else if (Array.isArray(content)) {
          formatted = content
            .map((item) => `• ${item.nombre || item}`)
            .join("\n\n");
        }

        // Si es objeto (como PERFIL, EDUCACION, etc.)
        else if (typeof content === "object") {
          formatted = Object.entries(content)
            .map(([k, val]) => {
              if (Array.isArray(val)) {
                return `🔹 ${k}:\n${val.map((v) => `   - ${v}`).join("\n")}`;
              } else if (typeof val === "object") {
                return `🔸 ${k}:\n${Object.entries(val)
                  .map(([subKey, subVal]) => {
                    if (Array.isArray(subVal)) {
                      return `   ▪ ${subKey}:\n${subVal
                        .map((v) => `     - ${v}`)
                        .join("\n")}`;
                    } else {
                      return `   ▪ ${subKey}: ${subVal}`;
                    }
                  })
                  .join("\n")}`;
              } else {
                return `🔸 ${k}: ${val}`;
              }
            })
            .join("\n\n");
        }

        setText(formatted);
      })
      .catch(() => setText("Error al cargar contenido."));
  }, [sectionName]);

  // Si es la galería de sushi, renderiza las fotos
  if (sectionName === "MI_SUSHI" && rawJson) {
    const fotos = rawJson["MI_SUSHI"];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-100 rounded shadow-inner overflow-y-auto h-[900px]">
        {fotos.map((foto, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow hover:shadow-xl transition transform hover:scale-105 p-2"
          >
            <img
              src={foto.imagen}
              alt={foto.nombre}
              className="rounded w-full h-48 object-cover"
            />
            <h3 className="font-semibold text-center mt-2">{foto.nombre}</h3>
            <p className="text-sm text-gray-600 text-center">{foto.descripcion}</p>
          </div>
        ))}
      </div>
    );
  }

  // Si es cualquier otra sección, muestra el texto formateado
  return (
    <div className="h-[900px] p-4 bg-gray-200 rounded text-sm text-gray-800 whitespace-pre-wrap shadow-md overflow-y-auto">
      {text}
    </div>
  );
}
