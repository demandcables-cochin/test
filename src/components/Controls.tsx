import { BASE_DAYS_PER_SEC, SPEED_LABELS, SPEED_STEPS } from "../data/bodies";

interface ControlsProps {
  playing: boolean;
  onTogglePlay: () => void;
  speedIdx: number;
  onSpeedIdx: (i: number) => void;
  showTrails: boolean;
  setShowTrails: (v: boolean) => void;
  showOrbits: boolean;
  setShowOrbits: (v: boolean) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  simDays: number;
}

const ToggleIcon = {
  trails: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 11.5C2 7 5.5 3.5 10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 3" />
      <circle cx="12.5" cy="4.5" r="2.2" fill="currentColor" />
    </svg>
  ),
  orbits: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12.6" cy="4.4" r="1.6" fill="currentColor" />
    </svg>
  ),
  labels: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.5 2.5h5.2l5.8 5.8-5.2 5.2-5.8-5.8V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="5.4" cy="5.4" r="1.1" fill="currentColor" />
    </svg>
  ),
};

function ToggleButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      aria-label={title}
      className={`flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-solar ${
        active
          ? "border-solar/60 bg-solar/10 text-solar shadow-[0_0_12px_rgba(255,181,77,0.15)]"
          : "border-white/10 text-faint hover:border-white/25 hover:text-dim"
      }`}
    >
      {children}
    </button>
  );
}

export function Controls(props: ControlsProps) {
  const {
    playing,
    onTogglePlay,
    speedIdx,
    onSpeedIdx,
    showTrails,
    setShowTrails,
    showOrbits,
    setShowOrbits,
    showLabels,
    setShowLabels,
    simDays,
  } = props;

  const days = Math.floor(simDays);
  const years = simDays / 365.25;
  const rate = Math.round(BASE_DAYS_PER_SEC * SPEED_STEPS[speedIdx]);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {/* mission clock */}
      <div
        className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5"
        title="Simulated elapsed time"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-emerald-400 animate-blink" : "bg-faint"}`}
          aria-hidden
        />
        <span className="font-mono text-[11px] tracking-wider text-dim">
          <span className="text-star">DAY {days.toLocaleString("en-US")}</span>
          <span className="mx-1.5 text-faint">·</span>
          {years.toFixed(2)} YR
        </span>
      </div>

      {/* play / pause */}
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? "Pause simulation (Space)" : "Play simulation (Space)"}
        title={playing ? "Pause (Space)" : "Play (Space)"}
        className="group flex h-9 w-9 items-center justify-center rounded-full border border-solar/60 bg-solar/10 text-solar transition-all duration-200 hover:bg-solar hover:text-[#201200] hover:shadow-[0_0_20px_rgba(255,181,77,0.35)] focus-visible:outline-2 focus-visible:outline-solar active:scale-95"
      >
        {playing ? (
          <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
            <rect x="2" y="1.5" width="3.6" height="11" rx="1" />
            <rect x="8.4" y="1.5" width="3.6" height="11" rx="1" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
            <path d="M3.2 1.6c0-.9 1-1.5 1.8-1L12.4 6c.8.5.8 1.6 0 2.1L5 12.5c-.8.5-1.8-.1-1.8-1V1.6Z" transform="translate(0 .7)" />
          </svg>
        )}
      </button>

      {/* speed selector */}
      <div className="flex items-center overflow-hidden rounded-md border border-white/10" role="group" aria-label="Simulation speed">
        {SPEED_STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeedIdx(i)}
            aria-pressed={i === speedIdx}
            className={`px-2.5 py-1.5 font-mono text-[11px] transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solar ${
              i === speedIdx
                ? "bg-solar font-semibold text-[#201200]"
                : "text-dim hover:bg-white/5 hover:text-star"
            } ${i > 0 ? "border-l border-white/10" : ""}`}
          >
            {SPEED_LABELS[i]}
          </button>
        ))}
      </div>
      <span className="hidden font-mono text-[10px] tracking-wider text-faint sm:inline" title="Simulated days per real second">
        ≈{rate} d/s
      </span>

      {/* layer toggles */}
      <div className="flex items-center gap-1.5" role="group" aria-label="Display layers">
        <ToggleButton active={showTrails} onClick={() => setShowTrails(!showTrails)} title="Toggle motion trails">
          {ToggleIcon.trails}
        </ToggleButton>
        <ToggleButton active={showOrbits} onClick={() => setShowOrbits(!showOrbits)} title="Toggle orbit paths">
          {ToggleIcon.orbits}
        </ToggleButton>
        <ToggleButton active={showLabels} onClick={() => setShowLabels(!showLabels)} title="Toggle name labels">
          {ToggleIcon.labels}
        </ToggleButton>
      </div>
    </div>
  );
}
