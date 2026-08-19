import { useEffect, useRef, useState } from "react";
import { BASE_DAYS_PER_SEC } from "../data/bodies";

/**
 * Drives the orrery clock. Returns the accumulated simulated elapsed time
 * in Earth days. Pausing freezes accumulation; changing the speed multiplier
 * scales how many simulated days pass per real second.
 */
export function useSimulation(playing: boolean, speedMultiplier: number): number {
  const [simDays, setSimDays] = useState(0);
  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1); // clamp tab-switch jumps
      last = now;
      setSimDays((d) => d + dt * BASE_DAYS_PER_SEC * speedRef.current);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return simDays;
}
