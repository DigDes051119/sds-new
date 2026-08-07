import React from "react";

export interface TextBlockData {
  font?: string;
  size?: string;
  align?: "left" | "center" | "right";
  text?: string;
  color?: string;
}

export const AVAILABLE_FONTS = [
  { name: "Inter", label: "Inter (Современный)" },
  { name: "TWK Everett", label: "TWK Everett (Премиум)" },
  { name: "Roboto", label: "Roboto (Строгий)" },
  { name: "Outfit", label: "Outfit (Геометричный)" },
  { name: "Playfair Display", label: "Playfair Display (с засечками)" },
  { name: "Space Grotesk", label: "Space Grotesk (Технологичный)" },
  { name: "Montserrat", label: "Montserrat (Плотный)" },
  { name: "Syne", label: "Syne (Акцентный)" },
];

export const AVAILABLE_SIZES = [
  { value: "14px", label: "Мелкий (14px)" },
  { value: "18px", label: "Обычный (18px)" },
  { value: "24px", label: "Крупный (24px)" },
  { value: "32px", label: "Большой (32px)" },
  { value: "48px", label: "Заголовок (48px)" },
];

export function parseTextBlock(blockUrl: string): TextBlockData | null {
  if (!blockUrl || !blockUrl.startsWith("text:")) return null;
  try {
    const jsonStr = blockUrl.slice(5);
    return JSON.parse(jsonStr);
  } catch (e) {
    const parts = blockUrl.slice(5).split("|");
    if (parts.length >= 4) {
      return {
        font: parts[0],
        size: parts[1],
        align: parts[2] as any,
        text: parts.slice(3).join("|")
      };
    }
    return { text: blockUrl.slice(5) };
  }
}

export function encodeTextBlock(data: TextBlockData): string {
  return `text:${JSON.stringify(data)}`;
}

export function TextBlockRenderer({ data, className = "" }: { data: TextBlockData; className?: string }) {
  if (!data || !data.text) return null;

  const font = data.font || "Inter";
  const size = data.size || "18px";
  const align = data.align || "left";
  const color = data.color || "inherit";

  return (
    <div
      className={`w-full max-w-full my-6 px-0 leading-relaxed whitespace-pre-line break-words ${className}`}
      style={{
        fontFamily: font === "TWK Everett" ? "'TWK Everett', 'Inter', sans-serif" : `'${font}', sans-serif`,
        fontSize: size,
        textAlign: align,
        color: color
      }}
    >
      {data.text}
    </div>
  );
}
