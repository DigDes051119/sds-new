interface GridSwitcherProps {
  cols: string;
  onChange: (cols: string) => void;
}

export function GridSwitcher({ cols, onChange }: GridSwitcherProps) {
  return (
    <div className="flex items-center gap-6 select-none shrink-0 self-baseline pt-1">
      {/* 2-in-a-row switcher */}
      <button
        type="button"
        onClick={() => onChange("2")}
        className="flex flex-col items-center gap-1.5 cursor-pointer group"
      >
        <div className="flex gap-1">
          <div className={`w-[24px] h-[10px] border transition-all duration-300 rounded-[1px] ${cols === "2" ? "border-[#0000FF] bg-[#0000FF]/10" : "border-black/35 group-hover:border-black"}`} />
          <div className={`w-[24px] h-[10px] border transition-all duration-300 rounded-[1px] ${cols === "2" ? "border-[#0000FF] bg-[#0000FF]/10" : "border-black/35 group-hover:border-black"}`} />
        </div>
        <div className={`h-[2px] w-full transition-all duration-300 rounded-full ${cols === "2" ? "bg-[#0000FF]" : "bg-transparent"}`} />
      </button>

      {/* 3-in-a-row switcher */}
      <button
        type="button"
        onClick={() => onChange("3")}
        className="flex flex-col items-center gap-1.5 cursor-pointer group"
      >
        <div className="flex gap-1">
          <div className={`w-[14px] h-[10px] border transition-all duration-300 rounded-[1px] ${cols === "3" ? "border-[#0000FF] bg-[#0000FF]/10" : "border-black/35 group-hover:border-black"}`} />
          <div className={`w-[14px] h-[10px] border transition-all duration-300 rounded-[1px] ${cols === "3" ? "border-[#0000FF] bg-[#0000FF]/10" : "border-black/35 group-hover:border-black"}`} />
          <div className={`w-[14px] h-[10px] border transition-all duration-300 rounded-[1px] ${cols === "3" ? "border-[#0000FF] bg-[#0000FF]/10" : "border-black/35 group-hover:border-black"}`} />
        </div>
        <div className={`h-[2px] w-full transition-all duration-300 rounded-full ${cols === "3" ? "bg-[#0000FF]" : "bg-transparent"}`} />
      </button>
    </div>
  );
}
