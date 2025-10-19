import { useState, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
// import { debounce } from 'lodash'

import { setCity, clearCity } from '@/store/slices/weatherSlice/currentCitySlice'
import { setQueryError, clearQueryError } from "@/store/slices/weatherSlice/currentQueryError"
import { useLazyGetCurrentWeatherQuery } from "@/store/weatherApi/weatherApi"

import { Button } from '../ui/button'

import type { AppDispatch, RootState } from '@/store'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

const WeatherInput = () => {
  const [inputCity, setInputCity] = useState<string>('')
  const [queryCity, setQueryCity] = useState<string>('')

  const currentTheme = useSelector((state: RootState) => state.theme.selectedTheme)
  // const currentCity = useSelector((state: RootState) => state.city.selectedCity)

  const dispatch = useDispatch<AppDispatch>()
  const [getCurrentQueryWeather] = useLazyGetCurrentWeatherQuery() 
    
  const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
    if (!error) return ''
    if ('status' in error) {
      switch (error.status) {
        case 404:
          return 'Город не найден. Проверьте название города.'
        case 429:
          return 'Слишком много запросов. Попробуйте позже.'
        case 400:
          return 'Некорректный запрос. Проверьте введенные данные.'
        case 401:
          return 'Ошибка авторизации. Проверьте API ключ.'
        case 500:
          return 'Ошибка сервера. Попробуйте позже.'
        default:
          return `Ошибка сервера: ${error.status}`
      }
    }
    if ('message' in error && error.message) { 
      return error.message
    }
    return 'Произошла неизвестная ошибка'
  }
  

  const currentVisibleCity = (cityName: string): string => {
    if (!cityName.trim()) return ''
    
    return cityName
      .split(/(\s+|-)/)
      .map((part) => {
        if (!part || part === ' ' || part === '-') return part
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      })
      .join('')
  }

  const handleSubmit = useCallback(async (e: any) => {
    e.preventDefault()
    clearQueryError()
    if (inputCity.trim()) {
      const result = await getCurrentQueryWeather(inputCity)
      console.log(getErrorMessage(result.error))
      if (result.data) {
        setQueryCity(result.data.name)
        dispatch(setCity(result.data.name))
      }
      if (result.error) {
        const errorMsg = getErrorMessage(result.error)
        setQueryError(errorMsg)
      }
    }
  }, [inputCity])
  
  const handleEditCity = () => {
    setQueryCity('')
    setInputCity('')
    clearQueryError()
  }


  if (queryCity) {
    return (
      <div className="p-2 flex items-center justify-between mx-8 mr-auto">
        <div className="flex items-center">
          <img 
            className='w-6 h-6'
            src={currentTheme === 'dark'
             ? 
             'src/context/icons/location-pointer-white.svg' 
             : 'src/context/icons/location-pointer-black.svg'} 
            alt="Location"
          />
          <span className="text-lg font-semibold cursor-pointer" onClick={handleEditCity}>
            {currentVisibleCity(inputCity)}
          </span>
        </div>
      </div>
    )
  }
  
  // if (!queryCity) {
    return (
      <div className="p-2 flex items-center border rounded mx-8 mr-auto">
        {/* <h3 className="text-lg font-bold mb-4">Поиск погоды</h3> */}
        <form onSubmit={handleSubmit} className="">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => {setInputCity(e.target.value)}}
            onClick={() => {
              setInputCity('')
              dispatch(clearCity())
            }}
            placeholder="Введите город..."
            className="border p-2 mr-2 rounded"
          />
          <Button 
            type="submit"
            className="p-4 rounded cursor-pointer"
          >
            Найти
          </Button>
        </form>
      </div>
    )
  }
// }
export default WeatherInput