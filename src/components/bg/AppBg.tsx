import "./AppBg.css"
import { useGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi";

import { useMemo, type PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils/cn";

import type { RootState } from "@/store"

type WeatherMode = 
  | "Thunderstorm"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Mist"
  | "Smoke"
  | "Haze"
  | "Dust"
  | "Fog"
  | "Sand"
  | "Ash"
  | "Squall"
  | "Tornado"
  | "Clear"
  | "Clouds";

const WEATHER_MODES: WeatherMode[] = [
  "Thunderstorm",
  "Drizzle",
  "Rain",
  "Snow",
  "Mist",
  "Smoke",
  "Haze",
  "Dust",
  "Fog",
  "Sand",
  "Ash",
  "Squall",
  "Tornado",
  "Clear",
  "Clouds",
];

const weatherConfig: Record<
  WeatherMode,
  { dayGradient: string, nightGradient: string }
> = {
  Thunderstorm: {
    dayGradient: "from-slate-800 via-indigo-900 to-slate-900",
    nightGradient: "from-slate-950 via-indigo-950 to-zinc-950",
  },
  Drizzle: {
    dayGradient: "from-slate-500 via-sky-600 to-blue-700",
    nightGradient: "from-slate-900 via-slate-800 to-indigo-950",
  },
  Rain: {
    dayGradient: "from-slate-700 via-sky-700 to-blue-900",
    nightGradient: "from-slate-950 via-slate-900 to-indigo-950",
  },
  Snow: {
    dayGradient: "from-slate-500 via-sky-600 to-indigo-900",
    nightGradient: "from-slate-900 via-slate-800 to-indigo-900",
  },
  Mist: {
    dayGradient: "from-slate-400 via-slate-500 to-sky-600",
    nightGradient: "from-slate-900 via-slate-800 to-slate-900",
  },
  Smoke: {
    dayGradient: "from-zinc-500 via-slate-600 to-slate-700",
    nightGradient: "from-zinc-900 via-slate-900 to-zinc-950",
  },
  Haze: {
    dayGradient: "from-amber-400 via-orange-300 to-sky-400",
    nightGradient: "from-slate-900 via-indigo-900 to-slate-800",
  },
  Dust: {
    dayGradient: "from-amber-500 via-orange-500 to-yellow-600",
    nightGradient: "from-amber-900 via-orange-950 to-zinc-900",
  },
  Fog: {
    dayGradient: "from-zinc-500 via-slate-500 to-slate-700",
    nightGradient: "from-zinc-900 via-slate-800 to-slate-900",
  },
  Sand: {
    dayGradient: "from-yellow-500 via-amber-600 to-orange-700",
    nightGradient: "from-amber-950 via-orange-950 to-zinc-900",
  },
  Ash: {
    dayGradient: "from-zinc-600 via-zinc-700 to-slate-800",
    nightGradient: "from-zinc-950 via-slate-950 to-black",
  },
  Squall: {
    dayGradient: "from-slate-700 via-slate-800 to-blue-900",
    nightGradient: "from-slate-950 via-slate-900 to-zinc-950",
  },
  Tornado: {
    dayGradient: "from-slate-700 via-zinc-800 to-slate-900",
    nightGradient: "from-zinc-950 via-slate-950 to-black",
  },
  Clear: {
    dayGradient: "from-sky-500 via-blue-500 to-cyan-400",
    nightGradient: "from-slate-950 via-indigo-950 to-blue-950",
  },
  Clouds: {
    dayGradient: "from-slate-600 via-slate-500 to-sky-700",
    nightGradient: "from-slate-900 via-slate-800 to-slate-950",
  },
};

export const AppBg = ({ children }: PropsWithChildren) => {
  // const [mode, setMode] = useState<WeatherMode>("Clear");
  // const [phase, setPhase] = useState<DayPhase>("day");
  // const [now, setNow] = useState(new Date());
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
  const { data: weather, isLoading } = useGetCurrentWeatherQuery(currentCity, {
      skip: !currentCity,
    })
  const currentDayPhase = useSelector((state: RootState) => state.dayPart.currentPart)

  const isWeatherMode = (value: unknown): value is WeatherMode =>
    typeof value === "string" && 
  WEATHER_MODES.includes(value as WeatherMode);

  const rawMode = weather?.weather?.[0]?.main;
  const hasWeatherData = !!currentCity && !isLoading && isWeatherMode(rawMode);

  // const mode = weather?.weather?.['0']?.main;

  // const rainDrops = useMemo(
  //   () =>
  //     Array.from({ length: 95 }, (_, i) => ({
  //       id: i,
  //       left: Math.random() * 100,
  //       delay: Math.random() * 2.5,
  //       duration: 0.7 + Math.random() * 0.9,
  //       opacity: 0.35 + Math.random() * 0.5,
  //     })),
  //   []
  // );

  // const snowflakes = useMemo(
  //   () =>
  //     Array.from({ length: 70 }, (_, i) => ({
  //       id: i,
  //       left: Math.random() * 100,
  //       delay: Math.random() * 6,
  //       duration: 4 + Math.random() * 6,
  //       size: 8 + Math.random() * 8,
  //       drift: -12 + Math.random() * 24,
  //       spin: -40 + Math.random() * 80,
  //       opacity: 0.4 + Math.random() * 0.6,
  //     })),
  //   []
  // );

  // const stars = useMemo(
  //   () =>
  //     Array.from({ length: 55 }, (_, i) => ({
  //       id: i,
  //       left: Math.random() * 100,
  //       top: Math.random() * 52,
  //       size: 1 + Math.random() * 2.2,
  //       delay: Math.random() * 4,
  //       duration: 2.8 + Math.random() * 3.6,
  //     })),
  //   []
  // );

   const rainHeavy = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.55 + Math.random() * 0.75,
        opacity: 0.35 + Math.random() * 0.5,
      })),
    []
  );

  const rainLight = useMemo(
    () =>
      Array.from({ length: 65 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.1 + Math.random() * 1,
        opacity: 0.25 + Math.random() * 0.35,
      })),
    []
  );

  const snowflakes = useMemo(
    () =>
      Array.from({ length: 78 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 6,
        size: 8 + Math.random() * 8,
        drift: -12 + Math.random() * 24,
        spin: -40 + Math.random() * 80,
        opacity: 0.4 + Math.random() * 0.6,
      })),
    []
  );

  const smokeParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: 8 + Math.random() * 84,
        size: 90 + Math.random() * 160,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 8,
        opacity: 0.08 + Math.random() * 0.18,
      })),
    []
  );

  const dustParticles = useMemo(
    () =>
      Array.from({ length: 160 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1.4 + Math.random() * 3.2,
        delay: Math.random() * 3,
        duration: 4.4 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.45,
      })),
    []
  );

  const ashParticles = useMemo(
    () =>
      Array.from({ length: 95 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 5,
        duration: 4.5 + Math.random() * 4,
        opacity: 0.25 + Math.random() * 0.4,
      })),
    []
  );

  const windStreaks = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        id: i,
        top: 12 + Math.random() * 76,
        width: 120 + Math.random() * 240,
        delay: Math.random() * 2.4,
        duration: 0.8 + Math.random() * 0.8,
        opacity: 0.14 + Math.random() * 0.2,
      })),
    []
  );

  const tornadoDebris = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        left: 38 + Math.random() * 24,
        size: 1.5 + Math.random() * 3.5,
        delay: Math.random() * 3,
        duration: 2.3 + Math.random() * 2.2,
        opacity: 0.22 + Math.random() * 0.36,
        driftX: -90 + Math.random() * 180,
        driftY: -50 - Math.random() * 70,
      })),
    []
  );

  const tornadoBands = useMemo(() => {
    const ringCount = 24;
    return Array.from({ length: ringCount }, (_, i) => {
      const progress = i / (ringCount - 1);
      const inverse = 1 - progress;
      return {
        id: i,
        top: 4 + progress * 90,
        // Верхняя часть заметно шире и уходит в грозовое облако.
        width: 12 + Math.pow(inverse, 0.72) * 78,
        height: 9 + inverse * 12,
        delay: i * 0.11,
        duration: 5.4 + progress * 1.8,
        opacity: 0.14 + inverse * 0.38,
        offsetX: Math.sin(i * 0.52) * 4.2,
        blur: 4.6 + inverse * 7.8,
        spin: 6 + progress * 2.5,
        stretch: 0.045 + inverse * 0.07,
        stretchDuration: 3.8 + progress * 2.3,
      };
    });
  }, []);

  const tornadoLinks = useMemo(
    () =>
      tornadoBands.slice(0, -1).map((band, i) => {
        const nextBand = tornadoBands[i + 1];
        return {
          id: i,
          top: band.top + 2.1,
          width: ((band.width + nextBand.width) / 2) * 0.9,
          height: 20 + (1 - i / (tornadoBands.length - 1)) * 12,
          opacity: (band.opacity + nextBand.opacity) * 0.5,
          drift: (band.offsetX + nextBand.offsetX) * 0.35,
        };
      }),
    [tornadoBands]
  );

  const tornadoWisps = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        top: 8 + Math.random() * 82,
        left: 45 + Math.random() * 10,
        width: 10 + Math.random() * 20,
        height: 16 + Math.random() * 34,
        delay: Math.random() * 3,
        duration: 4.6 + Math.random() * 2.2,
        opacity: 0.16 + Math.random() * 0.28,
      })),
    []
  );

  const tornadoSkirt = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: 8 + (i / 13) * 84,
        width: 14 + Math.random() * 22,
        height: 34 + Math.random() * 40,
        rotate: -20 + Math.random() * 40,
        delay: Math.random() * 2,
        duration: 5.6 + Math.random() * 2.6,
        opacity: 0.12 + Math.random() * 0.22,
      })),
    []
  );

  const tornadoInflowBands = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const lane = Math.floor(i / 2);
        const towardCenter = side < 0 ? 1 : -1;
        return {
          id: i,
          side,
          top: 6 + lane * 3.4 + Math.random() * 1.2,
          width: 20 + lane * 7 + Math.random() * 8,
          height: 10 + Math.random() * 5,
          rotate: towardCenter * (10 + lane * 2.2 + Math.random() * 2.4),
          delay: Math.random() * 2.8,
          duration: 7.2 + Math.random() * 2.6,
          opacity: 0.12 + Math.random() * 0.14,
          curve: towardCenter * (12 + Math.random() * 12),
        };
      }),
    []
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 52,
        size: 1 + Math.random() * 2.2,
        delay: Math.random() * 4,
        duration: 2.8 + Math.random() * 3.6,
      })),
    []
  );

  if (!hasWeatherData) {
    return <>{children}</>;
  }

  // const dayGradient = current.gradient;
  // const nightGradient =
  //   mode === "Thunderstorm"
  //     ? "from-slate-950 via-indigo-950 to-slate-900"
  //     : mode === "Rain"
  //       ? "from-slate-950 via-slate-900 to-indigo-950"
  //       : mode === "Snow"
  //         ? "from-slate-900 via-slate-800 to-indigo-900"
  //         : mode === "Clouds"
  //           ? "from-slate-900 via-slate-800 to-slate-950"
  //           : mode === "Fog"
  //             ? "from-zinc-900 via-slate-800 to-slate-900"
  //             : "from-slate-950 via-indigo-950 to-blue-950";
  // const activeGradient = currentDayPhase === "night" ? nightGradient : dayGradient;
  const mode: WeatherMode = rawMode;
  const current = weatherConfig[mode];
  const activeGradient = currentDayPhase === "night" ? current.nightGradient : current.dayGradient;
  const showClouds = ["Clouds", "Rain", "Thunderstorm", "Snow", "Drizzle", "Squall"].includes(mode);
  const showSunOrMoon = mode === "Clear" || mode === "Haze";

  return (
    <div className="relative min-h-screen">
      <div
        className={cn(
          "fixed inset-0 overflow-hidden  text-white bg-slate-900",
          currentDayPhase === "night" && "phase-night"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br transition-all duration-1000 weather-gradient-motion",
            activeGradient
          )}
        />
        <div
          className={cn(
            "absolute -top-36 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full blur-3xl transition-all duration-700",
            currentDayPhase === "night" ? "bg-indigo-300/10" : "bg-white/15"
          )}
        />
        <div
          className={cn(
            "absolute bottom-[-10rem] left-[-8rem] h-[24rem] w-[24rem] rounded-full blur-3xl transition-all duration-700",
            currentDayPhase === "night" ? "bg-blue-200/5" : "bg-cyan-200/10"
          )}
        />
        <div
          className={cn(
            "absolute right-[-8rem] top-[12rem] h-[20rem] w-[20rem] rounded-full blur-3xl transition-all duration-700",
            currentDayPhase === "night" ? "bg-violet-200/7" : "bg-indigo-200/10"
          )}
        />

        {currentDayPhase === "night" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {stars.map((star) => (
              <span
                key={star.id}
                className="night-star"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {showClouds && (
          <>
            <div className="cloud-group cloud-slow cloud-shape-a top-[8%] h-36 w-[36rem] opacity-85">
              <span className="cloud-part cloud-part-a" />
              <span className="cloud-part cloud-part-b" />
              <span className="cloud-part cloud-part-c" />
              <span className="cloud-part cloud-part-d" />
              <span className="cloud-part cloud-part-e" />
              <span className="cloud-part cloud-part-f" />
              <span className="cloud-vapor cloud-vapor-a" />
              <span className="cloud-shadow" />
            </div>
            <div className="cloud-group cloud-fast cloud-shape-b top-[23%] h-28 w-[28rem] opacity-70">
              <span className="cloud-part cloud-part-a" />
              <span className="cloud-part cloud-part-b" />
              <span className="cloud-part cloud-part-c" />
              <span className="cloud-part cloud-part-d" />
              <span className="cloud-part cloud-part-e" />
              <span className="cloud-part cloud-part-f" />
              <span className="cloud-vapor cloud-vapor-b" />
              <span className="cloud-shadow" />
            </div>
            <div className="cloud-group cloud-mid cloud-shape-c top-[34%] h-24 w-[24rem] opacity-55">
              <span className="cloud-part cloud-part-a" />
              <span className="cloud-part cloud-part-b" />
              <span className="cloud-part cloud-part-c" />
              <span className="cloud-part cloud-part-d" />
              <span className="cloud-part cloud-part-e" />
              <span className="cloud-part cloud-part-f" />
              <span className="cloud-vapor cloud-vapor-c" />
              <span className="cloud-shadow" />
            </div>
          </>
        )}

        {showSunOrMoon &&
          (currentDayPhase === "day" ? (
            <div className="sun-wrap absolute right-[9%] top-[9%] h-44 w-44 sun-pulse">
              <div className="sun-halo" />
              <div className="sun-glow" />
              <div className="sun-core" />
            </div>
          ) : (
            <div className="moon-wrap absolute right-[10%] top-[11%] h-36 w-36 moon-pulse">
              <div className="moon-halo" />
              <div className="moon-earthshine" />
              <div className="moon-disc" />
              <div className="moon-rimlight" />
              <div className="moon-shadow-cut" />
              <span className="moon-crater crater-a" />
              <span className="moon-crater crater-b" />
              <span className="moon-crater crater-c" />
            </div>
          ))}

        {(mode === "Rain" || mode === "Thunderstorm") && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {rainHeavy.map((drop) => (
              <span
                key={drop.id}
                className="rain-drop"
                style={{
                  left: `${drop.left}%`,
                  animationDelay: `${drop.delay}s`,
                  animationDuration: `${drop.duration}s`,
                  opacity: drop.opacity,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Drizzle" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {rainLight.map((drop) => (
              <span
                key={drop.id}
                className="drizzle-drop"
                style={{
                  left: `${drop.left}%`,
                  animationDelay: `${drop.delay}s`,
                  animationDuration: `${drop.duration}s`,
                  opacity: drop.opacity,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Snow" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {snowflakes.map((flake) => (
              <span
                key={flake.id}
                className="snow-flake"
                style={{
                  left: `${flake.left}%`,
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  opacity: flake.opacity,
                  transform: `translate3d(0, -10vh, 0) rotate(0deg)`,
                  animationDelay: `${flake.delay}s`,
                  animationDuration: `${flake.duration}s`,
                  ["--snow-drift" as string]: `${flake.drift}vw`,
                  ["--snow-spin" as string]: `${flake.spin}deg`,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Thunderstorm" && <div className="pointer-events-none absolute inset-0 lightning-flash" />}

        {mode === "Mist" && (
          <div className="mist-field pointer-events-none absolute inset-0 overflow-hidden">
            <div className="mist-layer mist-layer-a" />
            <div className="mist-layer mist-layer-b" />
            <div className="mist-layer mist-layer-c" />
          </div>
        )}

        {mode === "Fog" && (
          <div className="fog-blanket pointer-events-none absolute inset-0 overflow-hidden">
            <div className="fog-veil fog-veil-back" />
            <div className="fog-veil fog-veil-front" />
          </div>
        )}

        {mode === "Smoke" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {smokeParticles.map((particle) => (
              <span
                key={particle.id}
                className="smoke-particle"
                style={{
                  left: `${particle.left}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                  opacity: particle.opacity,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Haze" && (
          <div className="haze-layer pointer-events-none absolute inset-0 overflow-hidden">
            <div className="haze-veil" />
            <div className="haze-glow" />
          </div>
        )}

        {mode === "Dust" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="dust-haze" />
            {dustParticles.map((particle) => (
              <span
                key={particle.id}
                className="dust-particle"
                style={{
                  left: `${particle.left}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                  opacity: particle.opacity,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Sand" && (
          <div className="sand-fog pointer-events-none absolute inset-0 overflow-hidden">
            <div className="sand-fog-layer sand-fog-back" />
            <div className="sand-fog-layer sand-fog-mid" />
            <div className="sand-fog-layer sand-fog-front" />
          </div>
        )}

        {mode === "Ash" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {ashParticles.map((particle) => (
              <span
                key={particle.id}
                className="ash-particle"
                style={{
                  left: `${particle.left}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                  opacity: particle.opacity,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Squall" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {windStreaks.map((streak) => (
              <span
                key={streak.id}
                className="wind-streak"
                style={{
                  top: `${streak.top}%`,
                  width: `${streak.width}px`,
                  animationDelay: `${streak.delay}s`,
                  animationDuration: `${streak.duration}s`,
                  opacity: streak.opacity,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Tornado" && (
          <div className="tornado-wrap pointer-events-none absolute inset-0 overflow-hidden">
            <div className="tornado-sky-dim" />
            <div className="tornado-supercell" />
            <div className="tornado-ground-haze" />
            <div className="tornado-ring-column">
              <div className="tornado-inflow-field">
                {tornadoInflowBands.map((band) => (
                  <span
                    key={`inflow-${band.id}`}
                    className="tornado-inflow-band"
                    style={{
                      top: `${band.top}%`,
                      width: `${band.width}%`,
                      height: `${band.height}px`,
                      left: band.side < 0 ? "6%" : "94%",
                      ["--inflow-rot" as string]: `${band.rotate}deg`,
                      ["--inflow-curve" as string]: `${band.curve}px`,
                      animationDelay: `${band.delay}s`,
                      animationDuration: `${band.duration}s`,
                      opacity: band.opacity,
                    }}
                  />
                ))}
              </div>
              <div className="tornado-cloud-mouth" />
              <div className="tornado-top-fade" />
              <div className="tornado-funnel-skirt">
                {tornadoSkirt.map((fragment) => (
                  <span
                    key={`skirt-${fragment.id}`}
                    className="tornado-skirt-fragment"
                    style={{
                      left: `${fragment.left}%`,
                      width: `${fragment.width}%`,
                      height: `${fragment.height}px`,
                      ["--skirt-rot" as string]: `${fragment.rotate}deg`,
                      animationDelay: `${fragment.delay}s`,
                      animationDuration: `${fragment.duration}s`,
                      opacity: fragment.opacity,
                    }}
                  />
                ))}
              </div>
              {tornadoWisps.map((wisp) => (
                <span
                  key={`wisp-${wisp.id}`}
                  className="tornado-wisp"
                  style={{
                    top: `${wisp.top}%`,
                    left: `${wisp.left}%`,
                    width: `${wisp.width}%`,
                    height: `${wisp.height}px`,
                    animationDelay: `${wisp.delay}s`,
                    animationDuration: `${wisp.duration}s`,
                    opacity: wisp.opacity,
                  }}
                />
              ))}
              {tornadoLinks.map((link) => (
                <span
                  key={`link-${link.id}`}
                  className="tornado-link"
                  style={{
                    top: `${link.top}%`,
                    width: `${link.width}%`,
                    height: `${link.height}px`,
                    opacity: link.opacity,
                    ["--link-x" as string]: `${link.drift}px`,
                  }}
                />
              ))}
              {tornadoBands.map((band) => (
                <span
                  key={band.id}
                  className="tornado-ring"
                  style={{
                    top: `${band.top}%`,
                    width: `${band.width}%`,
                    height: `${band.height}px`,
                    animationDelay: `${band.delay}s`,
                    animationDuration: `${band.duration}s`,
                    opacity: band.opacity,
                    ["--band-x" as string]: `${band.offsetX}px`,
                    ["--ring-spin" as string]: `${band.spin}s`,
                    ["--ring-stretch" as string]: `${band.stretch}`,
                    ["--ring-stretch-duration" as string]: `${band.stretchDuration}s`,
                    filter: `blur(${band.blur}px)`,
                  }}
                >
                  <span className="tornado-ring-core" />
                  <span className="tornado-ring-shear" />
                  <span className="tornado-ring-shade" />
                </span>
              ))}
            </div>
            <div className="tornado-contact-spray" />
            {tornadoDebris.map((particle) => (
              <span
                key={particle.id}
                className="tornado-debris"
                style={{
                  left: `${particle.left}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                  opacity: particle.opacity,
                  ["--debris-x" as string]: `${particle.driftX}px`,
                  ["--debris-y" as string]: `${particle.driftY}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* {(mode === "Clouds" || mode === "Rain" || mode === "Thunderstorm" || mode === "Snow") && (
          <>
            <div className="cloud-group cloud-slow top-[8%] h-36 w-[36rem] opacity-85">
              <span className="cloud-part cloud-part-a" />
              <span className="cloud-part cloud-part-b" />
              <span className="cloud-part cloud-part-c" />
              <span className="cloud-shadow" />
            </div>
            <div className="cloud-group cloud-fast top-[23%] h-28 w-[28rem] opacity-70">
              <span className="cloud-part cloud-part-a" />
              <span className="cloud-part cloud-part-b" />
              <span className="cloud-part cloud-part-c" />
              <span className="cloud-shadow" />
            </div>
            <div className="cloud-group cloud-mid top-[34%] h-24 w-[24rem] opacity-55">
              <span className="cloud-part cloud-part-a" />
              <span className="cloud-part cloud-part-b" />
              <span className="cloud-part cloud-part-c" />
              <span className="cloud-shadow" />
            </div>
          </>
        )}

        {(mode === "Clear" || mode === "Clouds") &&
          (currentDayPhase === "day" ? (
            <div className="sun-wrap absolute right-[9%] top-[9%] h-44 w-44 sun-pulse">
              <div className="sun-halo" />
              <div className="sun-glow" />
              <div className="sun-core" />
            </div>
          ) : (
            <div className="moon-wrap absolute right-[10%] top-[11%] h-36 w-36 moon-pulse">
              <div className="moon-halo" />
              <div className="moon-earthshine" />
              <div className="moon-disc" />
              <div className="moon-rimlight" />
              <div className="moon-shadow-cut" />
              <span className="moon-crater crater-a" />
              <span className="moon-crater crater-b" />
              <span className="moon-crater crater-c" />
            </div>
          ))}

        {(mode === "Rain" || mode === "Thunderstorm") && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {rainDrops.map((drop) => (
              <span
                key={drop.id}
                className="rain-drop"
                style={{
                  left: `${drop.left}%`,
                  animationDelay: `${drop.delay}s`,
                  animationDuration: `${drop.duration}s`,
                  opacity: drop.opacity,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Snow" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {snowflakes.map((flake) => (
              <span
                key={flake.id}
                className="snow-flake"
                style={{
                  left: `${flake.left}%`,
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  opacity: flake.opacity,
                  transform: `translate3d(0, -10vh, 0) rotate(0deg)`,
                  animationDelay: `${flake.delay}s`,
                  animationDuration: `${flake.duration}s`,
                  ["--snow-drift" as string]: `${flake.drift}vw`,
                  ["--snow-spin" as string]: `${flake.spin}deg`,
                }}
              />
            ))}
          </div>
        )}

        {mode === "Thunderstorm" && <div className="pointer-events-none absolute inset-0 lightning-flash" />}
        {mode === "Fog" && (
          <div className="fog-blanket pointer-events-none absolute inset-0 overflow-hidden">
            <div className="fog-veil fog-veil-back" />
            <div className="fog-veil fog-veil-front" />
          </div>
        )} */}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
