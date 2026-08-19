export const TAU = Math.PI * 2;

/** Angular speed baseline: at 1× the clock advances 20 simulated days per real second. */
export const BASE_DAYS_PER_SEC = 20;

export const SPEED_STEPS = [0.5, 1, 2, 5, 10] as const;
export const SPEED_LABELS = ["½×", "1×", "2×", "5×", "10×"];

export interface Body {
  id: string;
  name: string;
  epithet: string;
  type: string;
  /** light-facing gradient stop */
  color: string;
  /** shadow gradient stop */
  colorDeep: string;
  diameterKm: number;
  distanceMkm: number;
  periodDays: number;
  periodLabel: string;
  dayLength: string;
  moons: number;
  tempC: string;
  gravity: string;
  fact: string;
  /** render-space orbit radius inside the 900×900 viewBox */
  orbitR: number;
  /** render-space planet radius (not to scale — compressed for legibility) */
  sizeR: number;
  /** starting orbital angle in radians so planets don't line up */
  startAngle: number;
}

export const SUN: Body = {
  id: "sun",
  name: "Sun",
  epithet: "The Star · G2V yellow dwarf",
  type: "Star",
  color: "#ffd76a",
  colorDeep: "#f0781e",
  diameterKm: 1392700,
  distanceMkm: 0,
  periodDays: 0,
  periodLabel: "≈230 Myr",
  dayLength: "25–35 d",
  moons: 0,
  tempC: "5,505 °C",
  gravity: "274 m/s²",
  fact: "The Sun holds 99.86% of all mass in the Solar System — the equivalent of 330,000 Earths. Light leaving its surface reaches Earth in 8 minutes 20 seconds, and Neptune in over 4 hours.",
  orbitR: 0,
  sizeR: 27,
  startAngle: 0,
};

export const BODIES: Body[] = [
  {
    id: "mercury",
    name: "Mercury",
    epithet: "The Swift Planet",
    type: "Terrestrial",
    color: "#c9b9a6",
    colorDeep: "#6f6355",
    diameterKm: 4879,
    distanceMkm: 57.9,
    periodDays: 87.97,
    periodLabel: "88 days",
    dayLength: "58.6 d",
    moons: 0,
    tempC: "167 °C",
    gravity: "3.7 m/s²",
    fact: "A year on Mercury lasts just 88 Earth days — yet one full day–night cycle (sunrise to sunrise) takes 176 days: exactly two of its years.",
    orbitR: 74,
    sizeR: 4,
    startAngle: 0.9,
  },
  {
    id: "venus",
    name: "Venus",
    epithet: "The Morning Star",
    type: "Terrestrial",
    color: "#f0cd7e",
    colorDeep: "#a97b33",
    diameterKm: 12104,
    distanceMkm: 108.2,
    periodDays: 224.7,
    periodLabel: "225 days",
    dayLength: "243 d ⟲",
    moons: 0,
    tempC: "464 °C",
    gravity: "8.9 m/s²",
    fact: "Venus spins backwards, so its Sun rises in the west — and so slowly that a single Venusian day outlasts its entire year.",
    orbitR: 106,
    sizeR: 6.5,
    startAngle: 3.9,
  },
  {
    id: "earth",
    name: "Earth",
    epithet: "The Blue Marble",
    type: "Terrestrial",
    color: "#6db4f2",
    colorDeep: "#1c4f96",
    diameterKm: 12742,
    distanceMkm: 149.6,
    periodDays: 365.25,
    periodLabel: "365.25 days",
    dayLength: "23.9 h",
    moons: 1,
    tempC: "15 °C",
    gravity: "9.8 m/s²",
    fact: "The only world known to host life. Liquid-water oceans cover 71% of its surface, and its large Moon steadies the axial tilt that gives us seasons.",
    orbitR: 142,
    sizeR: 7,
    startAngle: 5.5,
  },
  {
    id: "mars",
    name: "Mars",
    epithet: "The Red Planet",
    type: "Terrestrial",
    color: "#ef8354",
    colorDeep: "#96351a",
    diameterKm: 6779,
    distanceMkm: 227.9,
    periodDays: 686.98,
    periodLabel: "687 days",
    dayLength: "24.6 h",
    moons: 2,
    tempC: "−63 °C",
    gravity: "3.7 m/s²",
    fact: "Mars hosts Olympus Mons — a volcano nearly three times the height of Everest — and Valles Marineris, a canyon system as long as the continental United States.",
    orbitR: 178,
    sizeR: 5,
    startAngle: 2.2,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    epithet: "The Giant",
    type: "Gas giant",
    color: "#e3b584",
    colorDeep: "#8f5f36",
    diameterKm: 139820,
    distanceMkm: 778.5,
    periodDays: 4332.59,
    periodLabel: "11.9 years",
    dayLength: "9.9 h",
    moons: 95,
    tempC: "−108 °C",
    gravity: "24.8 m/s²",
    fact: "The Great Red Spot is a storm wider than Earth that has raged for at least 190 years. Jupiter's 95 known moons include Ganymede, the largest moon in the Solar System.",
    orbitR: 254,
    sizeR: 17,
    startAngle: 0.35,
  },
  {
    id: "saturn",
    name: "Saturn",
    epithet: "The Ringed World",
    type: "Gas giant",
    color: "#ecd9a0",
    colorDeep: "#a5854b",
    diameterKm: 116460,
    distanceMkm: 1433.5,
    periodDays: 10759.22,
    periodLabel: "29.4 years",
    dayLength: "10.7 h",
    moons: 146,
    tempC: "−139 °C",
    gravity: "10.4 m/s²",
    fact: "Saturn is so light for its size it would float in water. Its glorious rings span 280,000 km yet are, in places, barely ten metres thick — almost pure water ice.",
    orbitR: 310,
    sizeR: 14,
    startAngle: 4.6,
  },
  {
    id: "uranus",
    name: "Uranus",
    epithet: "The Ice Giant",
    type: "Ice giant",
    color: "#a8e4e6",
    colorDeep: "#3f8a92",
    diameterKm: 50724,
    distanceMkm: 2872.5,
    periodDays: 30688.5,
    periodLabel: "84 years",
    dayLength: "17.2 h ⟲",
    moons: 28,
    tempC: "−197 °C",
    gravity: "8.7 m/s²",
    fact: "Uranus rolls around the Sun on its side: its axis is tilted 98°, likely knocked over by a colossal ancient impact. Each pole gets 42 years of daylight, then 42 of night.",
    orbitR: 358,
    sizeR: 10,
    startAngle: 1.9,
  },
  {
    id: "neptune",
    name: "Neptune",
    epithet: "The Windy World",
    type: "Ice giant",
    color: "#6f8df5",
    colorDeep: "#27379b",
    diameterKm: 49244,
    distanceMkm: 4495.1,
    periodDays: 60182,
    periodLabel: "164.8 years",
    dayLength: "16.1 h",
    moons: 16,
    tempC: "−201 °C",
    gravity: "11.2 m/s²",
    fact: "Supersonic winds on Neptune top 2,100 km/h — the fastest in the Solar System — despite the planet receiving 900× less sunlight than Earth.",
    orbitR: 402,
    sizeR: 9.5,
    startAngle: 5.9,
  },
];

/** Sun first, then the eight planets in orbital order. */
export const ORDER: Body[] = [SUN, ...BODIES];

export const JUPITER_KM = 139820;
export const EARTH_KM = 12742;
export const AU_KM = 149.6; // million km per AU
export const LIGHT_KM_PER_S = 299792.458;
