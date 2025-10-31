import { useState, useCallback, useEffect, type FormEvent } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { cn } from "@/lib/utils"
// import { debounce } from 'lodash'

import { setCity, clearCity } from '@/store/slices/weatherSlice/currentCitySlice'
import { setQueryError, clearQueryError } from "@/store/slices/weatherSlice/currentQueryError"
import { useLazyGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"

import { Button } from '../ui/button'
import { buttonAnimation } from "@/lib/animations"

import type { AppDispatch, RootState } from '@/store'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

const WeatherInput = () => {
  const [inputCity, setInputCity] = useState<string>('')
  const [queryCity, setQueryCity] = useState<string>('')

  const currentTheme = useSelector((state: RootState) => state.theme.selectedTheme)

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

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    if (inputCity.trim()) {
      const result = await getCurrentQueryWeather(inputCity)
      if (result.data) {
        setQueryCity(result.data.name)
        dispatch(setCity(result.data.name))
        console.log(result.data.coord)
      }
      if (result.error) {
        const errorMsg = getErrorMessage(result.error)
        dispatch(setQueryError(errorMsg))
      }
    }
  }, [inputCity])
  
  const handleEditCity = () => {
    setQueryCity('')
    setInputCity('')
    dispatch(clearCity())
  }

  useEffect(() => {
    if (inputCity.length === 0) {
      dispatch(clearQueryError())
    }
  }, [inputCity])

  if (queryCity) {
    return (
      <div className="p-2 flex items-center justify-between mx-8 mr-auto">
        <div className="flex">
          <img 
            className='w-7 h-7'
            src={currentTheme === 'dark'
             ? 
             'src/context/icons/location-pointer-white.svg' 
             : 'src/context/icons/location-pointer-black.svg'} 
            alt="Location"
          />
          <span className="text-2xl font-semibold cursor-pointer" onClick={handleEditCity}>
            {queryCity}
          </span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center ml-8 mr-auto">
      {/* <h3 className="text-lg font-bold mb-4">Поиск погоды</h3> */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputCity}
          onChange={(e) => {setInputCity(e.target.value)}}
          onClick={() => {
            setInputCity('')
            dispatch(clearCity())
            dispatch(clearQueryError())
          }}
          placeholder="Введите город..."
          className="border p-2 mr-2 rounded"
        />
        <Button 
          type="submit"
          className={cn(buttonAnimation, "p-3 rounded cursor-pointer")}
          disabled={!inputCity.trim()}
        >
          Найти
        </Button>
      </form>
    </div>
  )
}
export default WeatherInput