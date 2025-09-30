import { useState } from 'react'
import { useGetCurrentWeatherQuery } from '../store/weatherApi/weatherApi.ts'

export const WeatherSearch = () => {
  const [searchCity, setSearchCity] = useState('')
  
  const { 
    data: weather, 
  } = useGetCurrentWeatherQuery(searchCity, {
    skip: searchCity === '', // Не выполнять запрос при пустом городе
  })

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
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