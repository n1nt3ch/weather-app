import { useGetCurrentWeatherQuery } from "@/store/weatherApi/weatherApi"

export const WeatherDisplay = () => {
  // Используем тот же query key - данные возьмутся из кэша!
  const { data: weather, isLoading, error } = useGetCurrentWeatherQuery('London', {
    // Можно указать другой город или использовать тот же
  })

  // Или получаем данные из props/context
  return (
    <div className="p-4 border rounded mt-4">
      <h3 className="text-lg font-bold mb-4">Отображение погоды</h3>
      
      {isLoading && <div>Загрузка погоды...</div>}
      {error && <div className="text-red-500">Ошибка загрузки</div>}
      
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
            <div>Давление: {weather.main.pressure} hPa</div>
          </div>
        </div>
      )}
    </div>
  )
}