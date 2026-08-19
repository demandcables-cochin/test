import { memo } from "react";
import { BODIES, SUN } from "../data/bodies";

interface DockProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function Chip({
  id,
  name,
  period,
  color,
  colorDeep,
  active,
  onClick,
}: {
  id: string;
  name: string;
  period: string;
  color: string;
  colorDeep: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-solar ${
        active
          ? "border-solar/70 bg-solar/10 shadow-[0_0_16px_rgba(255,181,77,0.12)]"
          : "border-white/10 bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/30"
      }`}
    >
      <span
        className="h-3.5 w-3.5 rounded-full"
        aria-hidden
        style={{
          background: `radial-gradient(circle at 32% 30%, ${color}, ${colorDeep})`,
          boxShadow: active ? `0 0 8px ${color}` : undefined,
        }}
      />
      <span className={`text-xs font-medium ${active ? "text-star" : "text-dim group-hover:text-star"}`}>{name}</span>
      <span className="hidden font-mono text-[10px] text-faint md:inline">{period}</span>
    </button>
  );
}

/** Bottom quick-nav: every world, one click away. */
export const PlanetDock = memo(function PlanetDock({ selectedId, onSelect }: DockProps) {
  return (
    <nav
      aria-label="Celestial bodies"
      className="scroll-slim relative z-20 flex h-[60px] items-center gap-2 overflow-x-auto border-t border-white/[0.06] bg-[#060818]/85 px-3 backdrop-blur-md md:justify-center md:px-6"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selectedId === null}
        className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-solar ${
          selectedId === null
            ? "border-solar/70 bg-solar/10"
            : "border-white/10 bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/30"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="2.2" fill="#ffb54d" />
          <ellipse cx="8" cy="8" rx="6.4" ry="2.8" stroke="#8b93b8" strokeWidth="1.1" transform="rotate(-18 8 8)" />
        </svg>
        <span className={`text-xs font-medium ${selectedId === null ? "text-star" : "text-dim"}`}>System view</span>
      </button>

      <span className="mx-1 h-5 w-px shrink-0 bg-white/10" aria-hidden />

      <Chip
        id={SUN.id}
        name="Sun"
        period="star"
        color={SUN.color}
        colorDeep={SUN.colorDeep}
        active={selectedId === SUN.id}
        onClick={() => onSelect(SUN.id)}
      />
      {BODIES.map((b, i) => (
        <Chip
          key={b.id}
          id={b.id}
          name={b.name}
          period={b.periodLabel}
          color={b.color}
          colorDeep={b.colorDeep}
          active={selectedId === b.id}
          onClick={() => onSelect(b.id)}
        />
      ))}
      <span className="hidden shrink-0 pl-2 font-mono text-[10px] tracking-widest text-faint lg:inline" aria-hidden>
        1–8 JUMP
      </span>
    </nav>
  );
});
