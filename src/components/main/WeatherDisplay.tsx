import { useGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { capitalize, getCityTime, CurrentDate, tempConvertation } from "@/lib/utils/otherFunc"
import { Hourly5DayForecast } from "./5DayForecast"

import type { RootState } from "@/store"

export const WeatherDisplay = () => {
  const [localTime, setLocalTime] = useState('');
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
  const currentTemp = useSelector((state: RootState) => state.settings.selectedTemp)
  const { data: weather, isLoading } = useGetCurrentWeatherQuery(currentCity, {
  })
  // const [daysCount, setDaysCount] = useState<number>(7);

  // console.log(weather.weather[0].description)
  // const currentWeatherIcon = (weatherType) => {
  //   switch (weatherType) {
  //     case 'Thunderstorm':
  //       return '';
  //     case 'Drizzle':
  //       return '';
  //     case 'Rain':
  //       return '';
  //     case 'Snow':
  //       return '';
  //     case 'Atmosphere':
  //       return '';
  //     case 'Clear':
  //       return '';
  //     case 'Clouds':
  //       return '';
  //     default: 
  //       return;
  //   }
  // }

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
          <div className="flex justify-between border rounded-2xl py-8 pl-6">
            <div className="flex flex-col gap-60">
              <h1 className="text-5xl">{capitalize(weather.weather[0].description)}</h1>
              <div className="flex flex-col content-between">
                <span className="text-6xl font-medium">{`${tempConvertation(weather.main.temp, currentTemp)}${currentTemp === 'c' ? '°C' : '°F'}`}</span>
                <span className="text-2xl">
                  {`${CurrentDate().dayName}, ${CurrentDate().day}.${CurrentDate().month}.${CurrentDate().year}, ${localTime}`}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
                className="size-50"
              />
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