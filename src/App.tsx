import { useCallback, useEffect, useRef, useState } from "react";
import { Controls } from "./components/Controls";
import { InfoPanel } from "./components/InfoPanel";
import { Orrery } from "./components/Orrery";
import { PlanetDock } from "./components/PlanetDock";
import { Starfield } from "./components/Starfield";
import { BODIES, ORDER, SPEED_STEPS } from "./data/bodies";
import { useSimulation } from "./hooks/useSimulation";

const NEBULA = {
  background: [
    "radial-gradient(52% 44% at 16% 20%, rgba(36,72,116,0.34), transparent 70%)",
    "radial-gradient(46% 40% at 86% 14%, rgba(98,44,80,0.22), transparent 70%)",
    "radial-gradient(60% 55% at 80% 90%, rgba(26,86,88,0.20), transparent 72%)",
    "radial-gradient(38% 36% at 28% 88%, rgba(118,70,30,0.12), transparent 70%)",
    "radial-gradient(30% 30% at 55% 45%, rgba(255,170,70,0.05), transparent 75%)",
  ].join(", "),
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [showTrails, setShowTrails] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const simDays = useSimulation(playing, SPEED_STEPS[speedIdx]);

  const handleToggleSelect = useCallback((id: string | null) => {
    setSelectedId((prev) => (id !== null && prev === id ? null : id));
  }, []);

  /* ---- keyboard shortcuts ---- */
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const onControl = tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA";
      if (e.code === "Space") {
        if (onControl) return; // let focused buttons handle their own space
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      } else if (/^[1-8]$/.test(e.key)) {
        setSelectedId(BODIES[Number(e.key) - 1].id);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const cur = selectedRef.current;
        const idx = cur ? ORDER.findIndex((b) => b.id === cur) : dir === 1 ? -1 : 0;
        setSelectedId(ORDER[(idx + dir + ORDER.length) % ORDER.length].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      {/* ambient layers */}
      <div className="fixed inset-0 z-0" style={NEBULA} aria-hidden />
      <Starfield />
      <div
        className="pointer-events-none fixed inset-0 z-[2]"
        aria-hidden
        style={{ background: "radial-gradient(120% 92% at 50% 42%, transparent 55%, rgba(3,2,10,0.6) 100%)" }}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* ---------- header ---------- */}
        <header className="shrink-0 border-b border-white/[0.06] bg-[#060818]/70 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden>
                <circle cx="16" cy="16" r="4.4" fill="#ffb54d" />
                <circle cx="16" cy="16" r="4.4" fill="none" stroke="#ffe9b0" strokeOpacity="0.6" strokeWidth="0.8" />
                <ellipse cx="16" cy="16" rx="13" ry="5.6" fill="none" stroke="#8b93b8" strokeWidth="1.1" transform="rotate(-18 16 16)" strokeOpacity="0.8" />
                <circle cx="27.4" cy="11.2" r="2.1" fill="#6f8df5" />
              </svg>
              <div className="leading-none">
                <div className="font-display text-[15px] font-bold tracking-[0.06em] text-star">
                  HELIOS<span className="text-solar"> ORRERY</span>
                </div>
                <div className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.3em] text-faint">
                  Eight worlds in motion
                </div>
              </div>
            </div>

            <div className="ml-auto">
              <Controls
                playing={playing}
                onTogglePlay={() => setPlaying((p) => !p)}
                speedIdx={speedIdx}
                onSpeedIdx={setSpeedIdx}
                showTrails={showTrails}
                setShowTrails={setShowTrails}
                showOrbits={showOrbits}
                setShowOrbits={setShowOrbits}
                showLabels={showLabels}
                setShowLabels={setShowLabels}
                simDays={simDays}
              />
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-solar/50 via-solar/10 to-transparent" aria-hidden />
        </header>

        {/* ---------- stage + panel ---------- */}
        <div className="flex min-h-0 flex-1">
          <main className="relative min-w-0 flex-1">
            <div className="absolute inset-0 p-1 md:p-3">
              <Orrery
                simDays={simDays}
                selectedId={selectedId}
                onSelect={handleToggleSelect}
                showTrails={showTrails}
                showOrbits={showOrbits}
                showLabels={showLabels}
              />
            </div>

            {/* click hint */}
            {selectedId === null && (
              <div className="animate-hint pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-[#0a0d22]/80 px-4 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                  Click a planet <span className="text-solar">◉</span> or press 1–8
                </span>
              </div>
            )}

            {/* instrument footnotes */}
            <div className="pointer-events-none absolute bottom-2.5 left-3 z-20 hidden flex-col gap-1 md:flex">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                Orbital periods true to ratio · sizes &amp; distances compressed
              </span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-faint/70 lg:inline">
                Space pause · ← → worlds · 1–8 jump · Esc close
              </span>
            </div>

            {/* mobile bottom sheet */}
            {selectedId !== null && (
              <div className="absolute inset-x-2 bottom-2 z-30 h-[46dvh] overflow-hidden rounded-lg border border-white/10 bg-[#070a1c]/95 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md md:hidden">
                <InfoPanel selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            )}
          </main>

          {/* desktop dossier rail */}
          <aside className="hidden w-[352px] shrink-0 border-l border-white/[0.06] bg-[#070a1c]/75 backdrop-blur-md md:block xl:w-[396px]">
            <InfoPanel selectedId={selectedId} onSelect={setSelectedId} />
          </aside>
        </div>

        {/* ---------- dock ---------- */}
        <PlanetDock selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
