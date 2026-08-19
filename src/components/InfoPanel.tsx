import { memo } from "react";
import { AU_KM, BODIES, EARTH_KM, JUPITER_KM, LIGHT_KM_PER_S, ORDER, SUN, type Body } from "../data/bodies";

interface PanelProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const nf = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: 0 });

const auOf = (mkm: number) => (mkm / AU_KM).toFixed(2);

const lightTime = (mkm: number) => {
  if (mkm <= 0) return "—";
  const mins = (mkm * 1e6) / LIGHT_KM_PER_S / 60;
  return mins < 90 ? `${mins.toFixed(1)} light-min` : `${(mins / 60).toFixed(1)} light-hrs`;
};

function Orb({ color, colorDeep, size = 52 }: { color: string; colorDeep: string; size?: number }) {
  return (
    <span
      className="shrink-0 rounded-full"
      aria-hidden
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 28%, #ffffffcc 0%, ${color} 22%, ${colorDeep} 100%)`,
        boxShadow: `0 0 24px ${color}55, inset -4px -6px 12px rgba(0,0,0,0.45)`,
      }}
    />
  );
}

function Stat({ label, value, sub, delay }: { label: string; value: string; sub?: string; delay: number }) {
  return (
    <div
      className="animate-fade-up rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 transition-colors hover:border-white/[0.14]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="font-mono text-[15px] font-medium leading-tight text-star">{value}</div>
      <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-faint">{label}</div>
      {sub && <div className="mt-0.5 font-mono text-[10px] text-dim">{sub}</div>}
    </div>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">{children}</div>
);

function Overview({ onSelect }: { onSelect: (id: string | null) => void }) {
  return (
    <div className="animate-fade-up p-5">
      <SectionLabel>System overview</SectionLabel>
      <h2 className="font-display text-lg font-bold leading-snug text-star">
        Eight worlds,
        <br />
        one ordinary star.
      </h2>
      <p className="mt-3 text-[13px] leading-relaxed text-dim">
        Click any world in the orrery — or a row below — to open its dossier. Orbital speeds keep their true
        ratios; sizes and distances are compressed to fit on one screen.
      </p>

      <div className="mt-5 space-y-1">
        {ORDER.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(b.id)}
            className="animate-fade-up group flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left transition-all duration-150 hover:border-white/[0.08] hover:bg-white/[0.045] focus-visible:outline-2 focus-visible:outline-solar"
            style={{ animationDelay: `${60 + i * 35}ms` }}
          >
            <span
              className="h-4 w-4 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-110"
              aria-hidden
              style={{ background: `radial-gradient(circle at 32% 30%, ${b.color}, ${b.colorDeep})` }}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-star">{b.name}</span>
              <span className="block text-[10px] uppercase tracking-wider text-faint">{b.type}</span>
            </span>
            <span className="font-mono text-[11px] text-dim">{b.id === "sun" ? "G2V" : b.periodLabel}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-solar"
            >
              <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-md border border-dashed border-white/10 p-3">
        <SectionLabel>Shortcuts</SectionLabel>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[10.5px] text-dim">
          <span><b className="text-star">SPACE</b> play / pause</span>
          <span><b className="text-star">1–8</b> jump to planet</span>
          <span><b className="text-star">← →</b> cycle worlds</span>
          <span><b className="text-star">ESC</b> back to overview</span>
        </div>
      </div>
    </div>
  );
}

function Dossier({ body, onSelect }: { body: Body; onSelect: (id: string | null) => void }) {
  const isSun = body.id === SUN.id;
  const idx = ORDER.findIndex((b) => b.id === body.id);
  const prev = ORDER[(idx - 1 + ORDER.length) % ORDER.length];
  const next = ORDER[(idx + 1) % ORDER.length];
  const planetNo = BODIES.findIndex((b) => b.id === body.id) + 1;
  const barPct = Math.min(100, Math.max(1.6, (body.diameterKm / JUPITER_KM) * 100));

  const stats: { label: string; value: string; sub?: string }[] = isSun
    ? [
        { label: "Distance from Sun", value: "0 km", sub: "it is the centre" },
        { label: "Diameter", value: `${nf(body.diameterKm)} km`, sub: "109.2 × Earth" },
        { label: "Galactic year", value: body.periodLabel, sub: "one lap of the Milky Way" },
        { label: "Rotation", value: body.dayLength, sub: "differential (equator→pole)" },
        { label: "Planets in tow", value: "8", sub: "plus dwarfs, comets, dust" },
        { label: "Surface temp", value: body.tempC, sub: "photosphere · core 15M °C" },
        { label: "Gravity", value: body.gravity, sub: "28 × Earth's pull" },
        { label: "Mass share", value: "99.86%", sub: "of the whole Solar System" },
      ]
    : [
        { label: "Distance from Sun", value: `${nf(body.distanceMkm, 1)} M km`, sub: `${auOf(body.distanceMkm)} AU · ${lightTime(body.distanceMkm)}` },
        { label: "Diameter", value: `${nf(body.diameterKm)} km`, sub: `${(body.diameterKm / EARTH_KM).toFixed(2)} × Earth` },
        { label: "Orbital period", value: body.periodLabel, sub: `${nf(body.periodDays, 2)} Earth days` },
        { label: "Day length", value: body.dayLength, sub: "one full rotation" },
        { label: "Known moons", value: String(body.moons), sub: body.moons === 0 ? "no natural satellites" : "natural satellites" },
        { label: "Mean temp", value: body.tempC, sub: isSun ? "" : "cloud-top / surface" },
        { label: "Surface gravity", value: body.gravity, sub: `Earth = 9.8 m/s²` },
        { label: "Position", value: `#${planetNo}`, sub: "planet from the Sun" },
      ];

  return (
    <div key={body.id} className="p-5">
      {/* header */}
      <div className="animate-fade-up flex items-start gap-4">
        <Orb color={body.color} colorDeep={body.colorDeep} />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[22px] font-bold leading-tight text-star">{body.name}</h2>
          <p className="mt-0.5 text-xs text-dim">{body.epithet}</p>
          <span
            className="mt-2 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em]"
            style={{ borderColor: `${body.color}55`, color: body.color, background: `${body.color}14` }}
          >
            {body.type}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-label="Close dossier (Esc)"
          title="Back to overview (Esc)"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-dim transition-colors hover:border-white/30 hover:text-star focus-visible:outline-2 focus-visible:outline-solar"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* stats */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <Stat key={s.label} label={s.label} value={s.value} sub={s.sub} delay={40 + i * 30} />
        ))}
      </div>

      {/* size comparison */}
      <div className="animate-fade-up mt-5" style={{ animationDelay: "300ms" }}>
        <div className="flex items-baseline justify-between">
          <SectionLabel>Diameter vs Jupiter</SectionLabel>
          <span className="font-mono text-[10px] text-dim">
            {(body.diameterKm / JUPITER_KM).toFixed(body.diameterKm / JUPITER_KM >= 10 ? 1 : 2)} ×
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${barPct}%`,
              background: `linear-gradient(90deg, ${body.colorDeep}, ${body.color})`,
              boxShadow: `0 0 10px ${body.color}66`,
            }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[9px] text-faint">
          <span>0</span>
          <span>Jupiter · {nf(JUPITER_KM)} km</span>
        </div>
      </div>

      {/* field note */}
      <div
        className="animate-fade-up mt-5 rounded-r-md border-l-2 bg-white/[0.03] p-3.5"
        style={{ borderColor: body.color, animationDelay: "360ms" }}
      >
        <SectionLabel>Field note</SectionLabel>
        <p className="text-[13px] leading-relaxed text-star/85">{body.fact}</p>
      </div>

      {/* prev / next */}
      <div className="animate-fade-up mt-5 flex items-center justify-between gap-2" style={{ animationDelay: "420ms" }}>
        <button
          type="button"
          onClick={() => onSelect(prev.id)}
          className="group flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-dim transition-all hover:border-white/30 hover:text-star focus-visible:outline-2 focus-visible:outline-solar"
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            <path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {prev.name}
        </button>
        <span className="font-mono text-[10px] tracking-widest text-faint">{idx + 1} / {ORDER.length}</span>
        <button
          type="button"
          onClick={() => onSelect(next.id)}
          className="group flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-dim transition-all hover:border-white/30 hover:text-star focus-visible:outline-2 focus-visible:outline-solar"
        >
          {next.name}
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform group-hover:translate-x-0.5">
            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export const InfoPanel = memo(function InfoPanel({ selectedId, onSelect }: PanelProps) {
  const body = selectedId ? ORDER.find((b) => b.id === selectedId) ?? null : null;

  return (
    <div className="relative flex h-full flex-col">
      {/* accent edge in the selected body's colour */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] transition-colors duration-500"
        style={{ background: body ? `linear-gradient(90deg, ${body.color}, transparent 70%)` : "linear-gradient(90deg, #ffb54d88, transparent 70%)" }}
        aria-hidden
      />
      <div className="scroll-slim h-full overflow-y-auto pb-6">
        {body ? <Dossier body={body} onSelect={onSelect} /> : <Overview onSelect={onSelect} />}
      </div>
    </div>
  );
});
