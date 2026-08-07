import React from "react";
import { Trash2, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";
import { parseTextBlock, encodeTextBlock, TextBlockData, AVAILABLE_FONTS, AVAILABLE_SIZES } from "./TextBlockRenderer";

interface AdminTextBlockEditorProps {
  blockIdx: number;
  blockUrl: string;
  onChange: (newEncodedUrl: string) => void;
  onDelete: () => void;
}

export function AdminTextBlockEditor({
  blockIdx,
  blockUrl,
  onChange,
  onDelete,
}: AdminTextBlockEditorProps) {
  const data: TextBlockData = parseTextBlock(blockUrl) || {
    font: "Inter",
    size: "18px",
    align: "left",
    text: "",
  };

  const update = (fields: Partial<TextBlockData>) => {
    const updated = { ...data, ...fields };
    onChange(encodeTextBlock(updated));
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-3xl border border-dashed border-[#0000FF]/30 w-full shadow-sm">
      {/* Block Header */}
      <div className="flex justify-between items-center px-1 border-b border-black/5 pb-3">
        <span className="text-[11px] text-[#0000FF] font-bold uppercase tracking-wider flex items-center gap-2">
          <Type className="w-4 h-4" />
          Текстовый блок {blockIdx + 1}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Удалить этот текстовый блок?")) {
              onDelete();
            }
          }}
          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition duration-150 cursor-pointer text-[10px] uppercase flex items-center gap-1.5 border border-red-200/50"
        >
          <Trash2 className="w-3 h-3" />
          Удалить блок
        </button>
      </div>

      {/* Formatting Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-[#fafaf6] p-3 rounded-2xl border border-black/5">
        {/* 1. Font Selection (8 fonts) */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-wider text-black/50 block mb-1">Шрифт (8 видов)</label>
          <select
            value={data.font || "Inter"}
            onChange={(e) => update({ font: e.target.value })}
            className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-black text-xs focus:border-[#0000FF] outline-none font-medium cursor-pointer"
          >
            {AVAILABLE_FONTS.map((f) => (
              <option key={f.name} value={f.name}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Size Selection */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-wider text-black/50 block mb-1">Размер шрифта</label>
          <select
            value={data.size || "18px"}
            onChange={(e) => update({ size: e.target.value })}
            className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-black text-xs focus:border-[#0000FF] outline-none font-medium cursor-pointer"
          >
            {AVAILABLE_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Alignment Selection */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-wider text-black/50 block mb-1">Выравнивание</label>
          <div className="flex gap-1.5">
            {[
              { id: "left", label: "Лево", Icon: AlignLeft },
              { id: "center", label: "Центр", Icon: AlignCenter },
              { id: "right", label: "Право", Icon: AlignRight },
            ].map(({ id, label, Icon }) => {
              const isActive = (data.align || "left") === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => update({ align: id as any })}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0000FF] text-white border-[#0000FF] shadow-sm"
                      : "bg-white text-black/70 border-black/10 hover:bg-black/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Textarea Input */}
      <div>
        <label className="text-[9px] font-bold uppercase tracking-wider text-black/50 block mb-1">Текст блока</label>
        <textarea
          value={data.text || ""}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Введите ваш текст для этого блока здесь..."
          rows={4}
          className="w-full bg-[#fafaf6] border border-black/10 rounded-2xl p-3.5 text-black focus:border-[#0000FF] outline-none text-sm leading-relaxed"
        />
      </div>

      {/* Live Preview Inside Editor */}
      {data.text && (
        <div className="pt-2 border-t border-black/5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-black/40 block mb-2">Предварительный просмотр на сайте:</span>
          <div
            className="p-4 bg-[#fafaf6] rounded-2xl border border-black/5 whitespace-pre-line"
            style={{
              fontFamily: data.font === "TWK Everett" ? "'TWK Everett', 'Inter', sans-serif" : `'${data.font || "Inter"}', sans-serif`,
              fontSize: data.size || "18px",
              textAlign: data.align || "left",
            }}
          >
            {data.text}
          </div>
        </div>
      )}
    </div>
  );
}
