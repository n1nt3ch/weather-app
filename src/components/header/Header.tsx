import { useTheme } from "@/context/theme-provider"
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom"

import { useGetCurrentWeatherQuery } from "@/store/weatherApi/weatherApi";


const Header = () => {
  const [city, setCity] = useState('')
  const [searchCity, setSearchCity] = useState('')

  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const { 
    isLoading, 
    error, 
    isFetching 
  } = useGetCurrentWeatherQuery(searchCity, {
    skip: searchCity === '', // Не выполнять запрос при пустом городе
  })

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchCity(city)
  }

  return (
    <header className="sticky top-0 border-b z-50 bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to={'/'}>
          <img src={theme === 'dark' ? 'src/context/weather-logo(dark).png' : 'src/context/weather-logo(light).png'} 
          alt="Weather app logo" 
          className="h-14"/>
        </Link>
        <form onSubmit={handleSearch} className="mx-auto">
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
        <div>
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`flex items-center cursor-pointer transition-transform duration-500
            ${isDark ? 'rotate-180' : 'rotate-0'}
            `}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all"></Sun>
              ) : (
                <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all"></Moon>
              )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
