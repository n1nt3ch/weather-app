import React from 'react'
import { useState } from "react";
import { useGetCurrentWeatherQuery } from "@/store/weatherApi/weatherApi";


export const WeatherSearch = () => {
  const [city, setCity] = useState('')
  const [searchCity, setSearchCity] = useState('')
  
  const { 
    data: weather, 
    isLoading, 
    error 
  } = useGetCurrentWeatherQuery(searchCity, {
    skip: searchCity === '',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchCity(city)
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-4">Поиск погоды</h3>
      
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите город..."
          className="border p-2 mr-2 rounded"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Найти
        </button>
      </form>

      {isLoading && <div>Загрузка...</div>}
      {error && <div className="text-red-500">Ошибка!</div>}
      
      {weather && (
        <div className="bg-green-50 p-3 rounded">
          <p>Найдена погода для: {weather.name}</p>
        </div>
      )}
    </div>
  )
}

export default WeatherSearch