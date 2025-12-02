import { useGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { capitalize, getCityTime, CurrentDate, tempConvertation } from "@/lib/utils/otherFunc"
import { Hourly5DayForecast } from "./5DayForecast"
import { StaticDaylightCard } from "./StaticDaylightCard"
import { Cloudy, CloudDrizzle, CloudRain, CloudSnow, Sun, CloudLightning } from "lucide-react"

import type { RootState } from "@/store"

export const WeatherDisplay = () => {
  const [localTime, setLocalTime] = useState('');
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
  const currentTemp = useSelector((state: RootState) => state.settings.selectedTemp)
  const { data: weather, isLoading } = useGetCurrentWeatherQuery(currentCity, {
    skip: !currentCity,
  })
  // const [daysCount, setDaysCount] = useState<number>(7);

  // console.log(weather?.weather['0'].id)
  console.log( localTime.split(':').join(''))

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
        return (
          <Sun size={size}/>
        )
      case 'Clouds':
        return (
          <Cloudy size={size}/>
        )
      default: 
        return;
    }
  }

  const sunrise = weather?.sys.sunrise
  const sunset = weather?.sys.sunset

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
              <h1 className="text-5xl">{capitalize(weather.weather[0].description)}</h1>
              <div className="max-w-70"><StaticDaylightCard sunrise={sunrise} sunset={sunset}/></div>
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