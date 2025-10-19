import { useGetCurrentWeatherQuery } from "@/store/weatherApi/weatherApi"
import { useSelector } from "react-redux"

import type { RootState } from "@/store"

export const WeatherDisplay = () => {
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
  const { data: weather, isLoading, error } = useGetCurrentWeatherQuery(currentCity, {
  })

  return (
    <div className="p-4 border rounded mt-4">
      <h3 className="text-lg font-bold mb-4">Отображение погоды</h3>
      
      {isLoading && <div>Загрузка погоды...</div>}
      {/* {error && 'status' in error && (
        <div className="text-red-500">
          {error.status === 400 && 'Введите название города'}
          {error.status === 404 && 'Город не найден'}
          {error.status === 401 && 'Неверный API ключ'}
          {error.status === 429 && 'Превышен лимит запросов'}
          {error.status === 500 && 'Ошибка сервера'}
          {![404, 401, 429, 500, 400].includes(error.status as number) && `Ошибка ${error.status}`}
        </div>
      )} */}

      {weather && (
        <div className="bg-blue-50 p-4 rounded">
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
    </div>
  )
}