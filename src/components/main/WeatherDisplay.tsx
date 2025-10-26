import { useGetCurrentWeatherQuery } from "@/store/weatherApi/weatherApi"
import { useSelector } from "react-redux"

import type { RootState } from "@/store"

export const WeatherDisplay = () => {
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
  const { data: weather, isLoading } = useGetCurrentWeatherQuery(currentCity, {
  })

  return (
    <>
      {isLoading && <div>Загрузка погоды...</div>}

      {weather && (
        <div className="bg-blue-50 p-4 rounded">
          <div className="flex justify-between">
              <div className="flex flex-col">
                <h1 className="capitalize text-5xl">{weather.weather[0].description}</h1>
                <div>
                  <span className="text-6xl">
                    {Math.round(weather.main.temp)}°C
                  </span>
                </div>
              </div>
            </div>
          <h4 className="font-bold text-xl">
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
          </div>
        </div>
      )}
    </>
  )
}