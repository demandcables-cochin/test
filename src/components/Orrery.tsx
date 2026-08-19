import { memo, useMemo, useState } from "react";
import { BODIES, SUN, TAU, type Body } from "../data/bodies";

const C = 450; // center of the 900×900 viewBox

interface OrreryProps {
  simDays: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showTrails: boolean;
  showOrbits: boolean;
  showLabels: boolean;
}

/* Deterministic PRNG so the asteroid belt never reshuffles between renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TRAILS = [
  { arc: 1.15, opacity: 0.1 },
  { arc: 0.62, opacity: 0.2 },
  { arc: 0.26, opacity: 0.42 },
];

/* ---------- static scenery (rendered once) ---------- */

const Astrolabe = memo(function Astrolabe() {
  const ticks = useMemo(() => {
    const out = [];
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * TAU - Math.PI / 2;
      const major = i % 10 === 0;
      const r1 = 438;
      const r2 = major ? 425 : 432;
      out.push(
        <line
          key={i}
          x1={C + r1 * Math.cos(a)}
          y1={C + r1 * Math.sin(a)}
          x2={C + r2 * Math.cos(a)}
          y2={C + r2 * Math.sin(a)}
          stroke={major ? "#9aa4cf" : "#6b7398"}
          strokeOpacity={major ? 0.32 : 0.16}
          strokeWidth={major ? 1.3 : 0.7}
        />,
      );
    }
    return out;
  }, []);

  return (
    <g aria-hidden>
      <circle cx={C} cy={C} r={444} fill="none" stroke="#6b7398" strokeOpacity={0.13} strokeDasharray="1 7" />
      {ticks}
    </g>
  );
});

const OrbitRings = memo(function OrbitRings({
  showOrbits,
  selectedId,
}: {
  showOrbits: boolean;
  selectedId: string | null;
}) {
  if (!showOrbits) return null;
  return (
    <g aria-hidden>
      {BODIES.map((b) => {
        const active = selectedId === b.id;
        return (
          <circle
            key={b.id}
            className="orbit-ring"
            cx={C}
            cy={C}
            r={b.orbitR}
            fill="none"
            stroke={active ? b.color : "#8f97bd"}
            strokeOpacity={active ? 0.55 : 0.13}
            strokeWidth={active ? 1.5 : 1}
          />
        );
      })}
    </g>
  );
});

const BeltDots = memo(function BeltDots() {
  const dots = useMemo(() => {
    const rnd = mulberry32(42);
    return Array.from({ length: 170 }, () => {
      const r = 199 + rnd() * 24;
      const a = rnd() * TAU;
      return {
        x: C + r * Math.cos(a),
        y: C + r * Math.sin(a),
        s: 0.5 + rnd() * 1.1,
        o: 0.08 + rnd() * 0.3,
      };
    });
  }, []);
  return (
    <g aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#a89f8d" opacity={d.o} />
      ))}
    </g>
  );
});

const Defs = memo(function Defs() {
  return (
    <defs>
      {BODIES.map((b) => (
        <radialGradient key={b.id} id={`grad-${b.id}`} cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor={b.color} />
          <stop offset="100%" stopColor={b.colorDeep} />
        </radialGradient>
      ))}
      <radialGradient id="grad-sun" cx="40%" cy="36%" r="75%">
        <stop offset="0%" stopColor="#fff6cf" />
        <stop offset="45%" stopColor="#ffd76a" />
        <stop offset="100%" stopColor="#f0781e" />
      </radialGradient>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,190,92,0.5)" />
        <stop offset="45%" stopColor="rgba(255,160,60,0.18)" />
        <stop offset="100%" stopColor="rgba(255,160,60,0)" />
      </radialGradient>
    </defs>
  );
});

/* ---------- dynamic pieces ---------- */

function SaturnRings({ b, front }: { b: Body; front: boolean }) {
  const rx = b.sizeR * 2.05;
  const ry = b.sizeR * 0.62;
  const stroke = "#d9c08a";
  if (!front) {
    return (
      <g transform="rotate(-18)" aria-hidden>
        <ellipse rx={rx} ry={ry} fill="none" stroke={stroke} strokeOpacity={0.65} strokeWidth={3.2} />
        <ellipse rx={rx * 0.78} ry={ry * 0.78} fill="none" stroke={stroke} strokeOpacity={0.4} strokeWidth={1.4} />
      </g>
    );
  }
  return (
    <g transform="rotate(-18)" aria-hidden>
      <path d={`M ${-rx} 0 A ${rx} ${ry} 0 0 0 ${rx} 0`} fill="none" stroke={stroke} strokeOpacity={0.85} strokeWidth={3.2} />
      <path
        d={`M ${-rx * 0.78} 0 A ${rx * 0.78} ${ry * 0.78} 0 0 0 ${rx * 0.78} 0`}
        fill="none"
        stroke={stroke}
        strokeOpacity={0.55}
        strokeWidth={1.4}
      />
    </g>
  );
}

function PlanetNode({
  b,
  simDays,
  selected,
  hovered,
  onSelect,
  onHover,
  showTrails,
  showLabels,
}: {
  b: Body;
  simDays: number;
  selected: boolean;
  hovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  showTrails: boolean;
  showLabels: boolean;
}) {
  const theta = b.startAngle + TAU * (simDays / b.periodDays);
  const x = C + b.orbitR * Math.cos(theta);
  const y = C + b.orbitR * Math.sin(theta);
  const circumference = TAU * b.orbitR;
  const labelVisible = showLabels || hovered || selected;

  const moonAngle = TAU * (simDays / 27.32) + 1.2;

  return (
    <g>
      {showTrails &&
        TRAILS.map((t, i) => {
          const len = t.arc * b.orbitR;
          const start = ((((theta - t.arc) % TAU) + TAU) % TAU) * b.orbitR;
          return (
            <circle
              key={i}
              cx={C}
              cy={C}
              r={b.orbitR}
              fill="none"
              stroke={b.color}
              strokeWidth={Math.min(b.sizeR * 0.85, 8)}
              strokeLinecap="round"
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-start}
              opacity={t.opacity}
              aria-hidden
            />
          );
        })}

      <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
        {labelVisible && (
          <text
            y={-(b.sizeR + 13)}
            textAnchor="middle"
            fontSize={11}
            className="font-mono uppercase"
            letterSpacing="0.18em"
            fill={selected || hovered ? "#e9edfb" : "#99a2c8"}
            opacity={selected || hovered ? 1 : 0.8}
            style={{ pointerEvents: "none", transition: "fill .25s, opacity .25s" }}
          >
            {b.name}
          </text>
        )}

        <g
          className="planet-pop cursor-pointer"
          onClick={() => onSelect(b.id)}
          onMouseEnter={() => onHover(b.id)}
          onMouseLeave={() => onHover(null)}
        >
          <title>{`${b.name} — click for details`}</title>
          {b.id === "saturn" && <SaturnRings b={b} front={false} />}
          <circle r={b.sizeR} fill={`url(#grad-${b.id})`} />
          {b.id === "saturn" && <SaturnRings b={b} front={true} />}
          {b.id === "earth" && (
            <g aria-hidden>
              <circle r={15} fill="none" stroke="#9fb4e8" strokeOpacity={0.18} strokeWidth={0.8} />
              <circle cx={15 * Math.cos(moonAngle)} cy={15 * Math.sin(moonAngle)} r={2.4} fill="#cfd6ea" />
            </g>
          )}
          {/* generous invisible hit area (covers Saturn's rings) */}
          <circle r={b.id === "saturn" ? b.sizeR * 2.15 : Math.max(b.sizeR + 7, 13)} fill="transparent" />
          {selected && (
            <circle className="sel-ring" r={b.sizeR + 6} fill="none" stroke={b.color} strokeWidth={1.6} />
          )}
          {hovered && !selected && (
            <circle r={b.sizeR + 5} fill="none" stroke={b.color} strokeOpacity={0.55} strokeWidth={1.1} />
          )}
        </g>
      </g>
    </g>
  );
}

function SunNode({
  selected,
  hovered,
  onSelect,
  onHover,
  showLabels,
}: {
  selected: boolean;
  hovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  showLabels: boolean;
}) {
  return (
    <g>
      <circle cx={C} cy={C} r={92} fill="url(#sunGlow)" aria-hidden />
      <circle cx={C} cy={C} r={46} fill="url(#sunGlow)" className="sun-pulse" aria-hidden />
      <g
        className="planet-pop cursor-pointer"
        onClick={() => onSelect(SUN.id)}
        onMouseEnter={() => onHover(SUN.id)}
        onMouseLeave={() => onHover(null)}
      >
        <title>Sun — click for details</title>
        <circle cx={C} cy={C} r={SUN.sizeR} fill="url(#grad-sun)" />
        <circle cx={C} cy={C} r={SUN.sizeR} fill="none" stroke="#ffe9b0" strokeOpacity={0.55} strokeWidth={1} />
        <circle cx={C} cy={C} r={36} fill="transparent" />
        {selected && <circle className="sel-ring" cx={C} cy={C} r={36} fill="none" stroke="#ffd76a" strokeWidth={1.6} />}
      </g>
      {(showLabels || hovered || selected) && (
        <text
          x={C}
          y={C + SUN.sizeR + 26}
          textAnchor="middle"
          fontSize={11}
          className="font-mono uppercase"
          letterSpacing="0.18em"
          fill={selected || hovered ? "#ffe9b0" : "#c9a86a"}
          style={{ pointerEvents: "none" }}
        >
          Sun
        </text>
      )}
    </g>
  );
}

/* ---------- main component ---------- */

export function Orrery({ simDays, selectedId, onSelect, showTrails, showOrbits, showLabels }: OrreryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const beltDeg = ((simDays / 1680) * 360) % 360;

  return (
    <svg
      viewBox="0 0 900 900"
      className="h-full w-full"
      role="img"
      aria-label="Orrery: the Sun and eight planets in orbital motion"
    >
      <Defs />
      <Astrolabe />
      <OrbitRings showOrbits={showOrbits} selectedId={selectedId} />
      <g transform={`rotate(${beltDeg.toFixed(3)} ${C} ${C})`}>
        <BeltDots />
      </g>

      <SunNode
        selected={selectedId === SUN.id}
        hovered={hoveredId === SUN.id}
        onSelect={onSelect}
        onHover={setHoveredId}
        showLabels={showLabels}
      />

      {BODIES.map((b) => (
        <PlanetNode
          key={b.id}
          b={b}
          simDays={simDays}
          selected={selectedId === b.id}
          hovered={hoveredId === b.id}
          onSelect={onSelect}
          onHover={setHoveredId}
          showTrails={showTrails}
          showLabels={showLabels}
        />
      ))}
    </svg>
  );
}
