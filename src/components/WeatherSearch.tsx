import { useState } from 'react'
import { useGetCurrentWeatherQuery } from '../store/weatherApi'

export const WeatherSearch = () => {
  const [city, setCity] = useState('')
  const [searchCity, setSearchCity] = useState('')
  
  const { 
    data: weather, 
    isLoading, 
    error, 
    isFetching 
  } = useGetCurrentWeatherQuery(searchCity, {
    skip: searchCity === '', // Не выполнять запрос при пустом городе
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchCity(city)
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Загрузка погоды...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Ошибка при получении данных о погоде
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Введите город..."
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Найти
          </button>
        </div>
      </form>

      {weather && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {weather.name}, {weather.sys.country}
          </h2>
          
          <div className="flex items-center justify-center mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-16 h-16"
            />
            <div className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </div>
          </div>

          <p className="text-lg capitalize mb-2">
            {weather.weather[0].description}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-semibold">Ощущается как</div>
              <div>{Math.round(weather.main.feels_like)}°C</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-semibold">Влажность</div>
              <div>{weather.main.humidity}%</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-semibold">Ветер</div>
              <div>{weather.wind.speed} м/с</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-semibold">Давление</div>
              <div>{weather.main.pressure} hPa</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}