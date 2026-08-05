import React from "react";

export function renderCommaSplitList(text: any) {
  if (typeof text !== "string" || !text || text === "-") return text || "-";
  if (!text.includes(",")) return text;
  const parts = text.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <span className="flex flex-col gap-0.5 text-right">
      {parts.map((part, idx) => (
        <span key={idx} className="block whitespace-nowrap">
          {part}{idx < parts.length - 1 ? "," : ""}
        </span>
      ))}
    </span>
  );
}
