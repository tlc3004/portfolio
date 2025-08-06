import { useEffect, useState } from "react";

export default function BioText({ sectionName }) {
  const [text, setText] = useState("INDICE");

  useEffect(() => {
    if (!sectionName) return;

    fetch("/data/bio.txt")
      .then((res) => res.text())
      .then((data) => {
        const sections = data.split("###").reduce((acc, part) => {
          const [titleLine, ...contentLines] = part.trim().split("\n");
          if (titleLine && contentLines.length > 0) {
            acc[titleLine.trim().toUpperCase()] = contentLines.join("\n").trim();
          }
          return acc;
        }, {});

        const selected = sections[sectionName.toUpperCase()];
        setText(selected || "Sección no encontrada.");
      })
      .catch(() => setText("Error al cargar la información."));
  }, [sectionName]);

  return (
    <div className="p-4 bg-gray-100 rounded text-sm text-gray-800 whitespace-pre-wrap shadow-md flex-1">
      {text}
    </div>
  );
}
