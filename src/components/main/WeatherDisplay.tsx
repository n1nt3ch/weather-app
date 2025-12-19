import { useGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { capitalize, getCityTime, CurrentDate, tempConvertation, formatSunriseSunsetFromWeather } from "@/lib/utils/otherFunc"
import { Hourly5DayForecast } from "./5DayForecast"
import { Cloudy, CloudDrizzle, CloudRain, CloudSnow, Sun, CloudLightning, Moon, Sunrise, Sunset } from "lucide-react"

import type { RootState } from "@/store"
import { cn } from "@/lib/utils/cn"

export const WeatherDisplay = () => {
  const [localTime, setLocalTime] = useState('');
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
  const currentTemp = useSelector((state: RootState) => state.settings.selectedTemp)
  const { data: weather, isLoading } = useGetCurrentWeatherQuery(currentCity, {
    skip: !currentCity,
  })
  const sunrise = weather?.sys.sunrise
  const sunset = weather?.sys.sunset
  console.log(weather)

  const {sunriseTime, sunsetTime } = formatSunriseSunsetFromWeather(weather);
  const [sunriseHours, sunriseMinutes] = sunriseTime.split(':');
  const [sunsetHours, sunsetMinutes] = sunsetTime.split(':');

  const sunriseForIcons = Number((sunriseTime).split(':').join(''))
  const sunsetForIcons = Number((sunsetTime).split(':').join(''))
  const currentTimeForIcons = Number(localTime.split(':').join(''))
  
  // console.log( localTime.split(':').join(''))

  const currentWeatherIcon = (weatherDesc: string, size: number) => {
    switch (weatherDesc) {
      case 'Thunderstorm':
        return (
          <CloudLightning size={size}/>
        )
      case 'Drizzle':
        return (
          <CloudDrizzle size={size}/>
        )
      case 'Rain':
        return (
          <CloudRain size={size}/>
        )
      case 'Snow':
        return (
          <CloudSnow size={size}/>
        )
      case 'Clear':
        // return (
        //   <Sun size={size}/>
        // )
        return (sunriseForIcons < currentTimeForIcons < sunsetForIcons) ? (<Sun size={size}/>) : (<Moon size={size}/>);
      case 'Clouds':
        return (
          <Cloudy size={size}/>
        )
      default: 
        return;
    }
  }

  const StaticDaylightCard = () => {
    const currentTheme = useSelector((state: RootState) => state.settings.selectedTheme)
  
    // Расчёт длительности светового дня
    const daylightMinutes = Math.floor((sunset - sunrise) / 60);
    const hours = Math.floor(daylightMinutes / 60);
    const minutes = Math.floor(daylightMinutes % 60);
  
    const cardBg = cn(
      currentTheme === 'dark' ? 'bg-neutral-800' : 'bg-blue-100'
    )
  
    return (
      <div className={`${cardBg} flex flex-col items-center justify-center p-4 rounded-lg`}>
        {/* Дуга */}
        <div className="relative w-full max-w-md h-24 ">
          {/* Фоновая дуга (серая, пунктирная) — вторая половина */}
          <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
            <path
              d="M100,40 A80,30 0 0,1 180,65"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="4 8" // 🔥 Прерывистая линия
            />
          </svg>
  
          {/* Желтая дуга — первая половина (от начала до середины) */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 80"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 pointer-events-none"
          >
            <path
              d="M20,65 A80,30 0 0,1 100,40"
              fill="none"
              stroke="#f59e0b" // 🟡 Жёлтый цвет
              strokeWidth="4"
              strokeLinecap="round"
              strokeOpacity="1"
            />
          </svg>
          <div className="absolute w-4 h-4 bg-yellow-500 rounded-full pointer-events-none top-10 left-29"/></div>
  
        {/* Иконки солнца и время */}
        <div className='flex justify-between w-full text-sm'>
          <div className="flex flex-col items-center">
            <Sunrise className="w-6 h-6 text-yellow-500 mb-1" />
            <span>{`${sunriseHours - 3}:${sunriseMinutes}`}</span>
          </div>
          <div className="text-center">
            <p>Световой день</p>
            <p>{hours} ч {minutes} мин</p>
          </div>
          <div className="flex flex-col items-center">
            <Sunset className="w-6 h-6 text-blue-900 mb-1" />
            <span>{`${sunsetHours -3}:${sunsetMinutes}`}</span>
          </div>
        </div>
      </div>
    );
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
 
  return (
    <>
      {isLoading && <div>Загрузка погоды...</div>}

      {weather && (
        <div className="pt-4">
          <div className="flex justify-between border rounded-2xl py-8 px-12 relative">
            {/* <div className="absolute top-1/2 left-40 transform -translate-x-1/2 -translate-y-1/2">
              <StaticDaylightCard sunrise={sunrise} sunset={sunset}/>
            </div> */}
            <div className="flex flex-col gap-10">
              <h1 className="text-6xl font-medium">{capitalize(weather.name)}</h1>
              <h2 className="text-5xl font-medium">{capitalize(weather.weather[0].description)}</h2>
              <div className="max-w-70"><StaticDaylightCard sunrise={sunrise} sunset={sunset} timezone={weather.timezone}/></div>
              <div className="flex flex-col content-between">
                <span className="text-6xl font-medium">{`${tempConvertation(weather.main.temp, currentTemp)}${currentTemp === 'c' ? '°C' : '°F'}`}</span>
                <span className="text-2xl">
                  {`${CurrentDate().dayName}, ${CurrentDate().day}.${CurrentDate().month}.${CurrentDate().year}, ${localTime}`}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              {/* <img
                src={currentWeatherIcon(weather.weather[0].main)}
                alt={weather.weather[0].description}
                className="size-50 mr-10"
              /> */}
              {currentWeatherIcon(weather.weather[0].main, 250)}
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