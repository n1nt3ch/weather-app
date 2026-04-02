import { useGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"
import { setDayPart, setNightPart } from "@/store/slices/partOfTheDaySlice"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { capitalize, isDark, getCityTime, CurrentDate, tempConvertation, formatSunriseSunsetFromWeather } from "@/lib/utils/otherFunc"
import { Hourly5DayForecast } from "./5DayForecast"
import { Cloudy, CloudDrizzle, CloudRain, CloudSnow, Sun, CloudLightning, Moon, Sunrise, Sunset, CloudFog } from "lucide-react"

import type { AppDispatch, RootState } from "@/store"
import { cn } from "@/lib/utils/cn"
import { createPortal } from "react-dom"

export const WeatherDisplay = () => {
  const [localTime, setLocalTime] = useState('');
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
  const currentTemp = useSelector((state: RootState) => state.settings.selectedTemp)
  const currentDayPart = useSelector((state: RootState) => state.dayPart.currentPart)
  const currentTheme = useSelector((state: RootState) => state.settings.selectedTheme)

  const { data: weather, isLoading } = useGetCurrentWeatherQuery(currentCity, {
    skip: !currentCity,
  });

  const dispatch = useDispatch<AppDispatch>()

  const sunrise = weather?.sys.sunrise
  const sunset = weather?.sys.sunset

  const {sunriseTime, sunsetTime } = formatSunriseSunsetFromWeather(weather);
  
  const [sunriseHoursStr, sunriseMinutesStr] = sunriseTime.split(':');
  const sunriseHours: number = parseInt(sunriseHoursStr, 10);
  const sunriseMinutes: number = parseInt(sunriseMinutesStr, 10);

  const [sunsetHoursStr, sunsetMinutesStr] = sunsetTime.split(':');
  const sunsetHours: number = parseInt(sunsetHoursStr, 10);
  const sunsetMinutes: number = parseInt(sunsetMinutesStr, 10);

  const sunriseForIcons = Number(`${sunriseHours - 3}${sunriseMinutes}`)
  const sunsetForIcons = Number(`${sunsetHours - 3}${sunsetMinutes}`)
  const currentTimeForIcons = Number(localTime.split(':').join(''))

  useEffect(() => {
    if(currentTimeForIcons === 0) return;
    if (sunriseForIcons < currentTimeForIcons && currentTimeForIcons < sunsetForIcons) {
      dispatch(setDayPart())
    } else {
      dispatch(setNightPart())
    }
  }, [currentTimeForIcons])

  const currentWeatherIcon = (weatherDesc: string, size: number) => {
    const color = !isDark(currentTheme) && currentDayPart === 'night' ? 'gray' : 'white';

    switch (weatherDesc) {
      case 'Thunderstorm': 
        return (
          <CloudLightning size={size} color={color}/>
        )
      case 'Drizzle':
        return (
          <CloudDrizzle size={size} color={color}/>
        )
      case 'Rain':
        return (
          <CloudRain size={size} color={color}/>
        )
      case 'Snow':
        return (
          <CloudSnow size={size} color={color}/>
        )
      case 'Clear':
        return currentDayPart === 'day' ?
          (<Sun size={size} color={color}/>) :
          (<Moon size={size} color={color}/>);
      case 'Clouds':
        return (
          <Cloudy size={size} color={color}/>
        )
      case 'Mist':
        return (
          <CloudFog size={size} color={color}/>
        )
      default: 
        return;
    }
  }

  type StaticDaylightCardProps = {
    sunrise: number;
    sunset: number;
    timezone: number;
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const formatCityTime = (unix: number, timezone: number) => {
    const d = new Date((unix + timezone) * 1000);
    return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  };

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

  const StaticDaylightCard = ({ sunrise, sunset, timezone }: StaticDaylightCardProps) => {
    const currentTheme = useSelector((state: RootState) => state.settings.selectedTheme);

    const daylightMinutes = Math.floor((sunset - sunrise) / 60);
    const hours = Math.floor(daylightMinutes / 60);
    const minutes = daylightMinutes % 60;

    const nowUnix = Math.floor(Date.now() / 1000);
    const progress = sunset > sunrise ? clamp01((nowUnix - sunrise) / (sunset - sunrise)) : 0;

    // Более круглая дуга: квадратичная Безье
    const p0 = { x: 20, y: 88 };
    const p1 = { x: 110, y: 10 }; // выше центр => более “круглая” дуга
    const p2 = { x: 200, y: 88 };

    const t = progress;
    const sunX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const sunY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

    const cardBg = cn(
      "rounded-2xl p-4 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
      currentTheme === "dark"
        ? "bg-slate-900/65 border-white/10 text-slate-100"
        : "bg-white/35 border-white/35 text-slate-800"
    );

    return (
      <div className={cardBg}>
        <div className="relative w-full max-w-md">
          <svg viewBox="0 0 220 110" className="w-full h-24">
            <defs>
              <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Фоновая дуга */}
            <path
              d="M20 88 Q110 10 200 88"
              fill="none"
              stroke="rgba(191, 201, 216, 0.65)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 10"
              pathLength={1}
            />

            {/* Пройденная часть */}
            <path
              d="M20 88 Q110 10 200 88"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${progress} 1`}
              className="transition-all duration-500 ease-out"
            />

            {/* Солнце (точно на дуге) */}
            <circle
              cx={sunX}
              cy={sunY}
              r="6.5"
              fill="#fbbf24"
              filter="url(#sunGlow)"
              className="transition-all duration-500 ease-out"
            />
          </svg>
        </div>

        <div className="mt-1 flex justify-between w-full text-sm">
          <div className="flex flex-col items-center">
            <Sunrise className="w-5 h-5 text-amber-400 mb-1" />
            <span>{formatCityTime(sunrise, timezone)}</span>
          </div>

          <div className="text-center">
            <p className="font-medium">Световой день</p>
            <p>{hours} ч {minutes} мин</p>
          </div>

          <div className="flex flex-col items-center">
            <Sunset className="w-5 h-5 text-indigo-300 mb-1" />
            <span>{formatCityTime(sunset, timezone)}</span>
          </div>
        </div>
      </div>
    );
  };

  const loadingSpin = () => {
    const styles = {
      wrapper: cn(currentTheme === 'light' ? 'bg-blue-100/50': 'bg-neutral-800/50'),
    }

    return createPortal(
      <div className={`${styles.wrapper} fixed inset-0 flex items-center justify-center z-9999 p-4 cursor-pointer`}>
        <div className="flex flex-col gap-4 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh]">
          <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6 text-slate-900">
            <section className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white p-8 text-center shadow-2xl backdrop-blur">
              <div className="mx-auto mb-5 size-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
              <h2 className="text-2xl">Загружаем погоду...</h2>
              <p className="mt-2 text-sm text-slate-600">Пожалуйста, подождите.</p>
            </section>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  useEffect(() => {
    if (!weather) return;
    
    const updateTime = () => {
      const time = getCityTime(weather.timezone);
      setLocalTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [weather]);

  if (isLoading) {
    return loadingSpin()
  }

  return (
    <>
      {weather && (
        <div className="pt-4">
          <div className="flex justify-between p-8 relative">
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-3">
                {currentWeatherIcon(weather.weather[0].main, 50)}
                <h2 className={cn("text-5xl leading-none font-semibold tracking-tight",
                  isDark(currentTheme) ? 
                  'text-slate-50/95 [text-shadow:0_1px_0_rgba(15,23,42,0.5),0_10px_28px_rgba(2,6,23,0.45)]' : 
                  'text-slate-300/95 [text-shadow:0_1px_0_rgba(255,255,255,0.24),0_10px_24px_rgba(15,23,42,0.22)]' 
                )}>
                {capitalize(weather.weather[0].description)}
                </h2>
              </div>
              <div className="max-w-70">
                {sunrise !== undefined && sunset !== undefined && (
                  <StaticDaylightCard
                    sunrise={sunrise}
                    sunset={sunset}
                    timezone={weather.timezone}
                  />
                )}
              </div>
              <div className="flex flex-col content-between">
                <span className={cn("text-6xl leading-[0.95] font-semibold tracking-[-0.03em]",
                  isDark(currentTheme) ? 
                  'text-white/95 [text-shadow:0_1px_0_rgba(15,23,42,0.45),0_12px_32px_rgba(2,6,23,0.5)]' : 
                  'text-slate-300/95 [text-shadow:0_1px_0_rgba(255,255,255,0.22),0_10px_30px_rgba(15,23,42,0.24)]' 
                )}>
                  {`${tempConvertation(weather.main.temp, currentTemp)}${currentTemp === 'c' ? '°C' : '°F'}`}
                </span>
                <span className={cn("text-4xl leading-tight font-medium",
                  isDark(currentTheme) ? 
                  'text-sky-50/95 [text-shadow:0_1px_8px_rgba(10,30,70,0.28)]' : 
                  'text-slate-300/60 [text-shadow:0_1px_0_rgba(255,255,255,0.22),0_10px_30px_rgba(15,23,42,0.24)]'
                )}>
                  {`${CurrentDate().dayName}, ${CurrentDate().day}.${CurrentDate().month}.${CurrentDate().year}, ${localTime}`}
                </span>
              </div>
            </div>
          </div>
          <Hourly5DayForecast
            lat={weather.coord.lat}
            lon={weather.coord.lon}
          />
        </div>
      )}
    </>
  )
}