import { useGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { capitalize, getCityTime, CurrentDate } from "@/lib/utils/otherFunc"
import { Hourly5DayForecast } from "./5DayForecast"

import type { RootState } from "@/store"

export const WeatherDisplay = () => {
  const [localTime, setLocalTime] = useState('');
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
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
      setLocalTime(time.toLocaleTimeString('ru-RU'));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [weather]);
 
  return (
    <>
      {isLoading && <div>Загрузка погоды...</div>}

      {weather && (
        <div className="py-8 rounded">
          <div className="flex justify-between">
              <div className="flex-col">
                <h1 className="text-5xl mb-24">{capitalize(weather.weather[0].description)}</h1>
                <div className="flex flex-col content-between">
                  <span className="text-6xl">
                    {Math.round(weather.main.temp)}°C
                  </span>
                  <span className="text-2xl">
                    {`${CurrentDate().dayName}, ${CurrentDate().day}.${CurrentDate().month}.${CurrentDate().year}, 
                     ${localTime}
                    `}
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
              cityName={currentCity}
            />
            
          {/* <h4 className="font-bold text-xl">
            {weather.name}, {weather.sys.country}
          </h4>
          <div className="flex items-center mt-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
            />
            <span className="text-2xl ml-2">
              {Math.round(weather.main.temp)}°C
            </span>
          </div>
          <p className="capitalize">{weather.weather[0].description}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Ощущается: {Math.round(weather.main.feels_like)}°C</div>
            <div>Влажность: {weather.main.humidity}%</div>
            <div>Ветер: {weather.wind.speed} м/с</div>
            <div>Давление: {Math.round(weather.main.pressure * 0.75)} мм.рт.ст</div>
          </div> */}
        </div>
      )}
    </>
  )
}