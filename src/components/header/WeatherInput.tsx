import { useState, useCallback, useEffect, type FormEvent } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { cn } from "@/lib/utils/cn"
import { debounce, values } from 'lodash'

import { setCity, clearCity } from '@/store/slices/weatherSlices/currentCitySlice'
import { setQueryError, clearQueryError } from "@/store/slices/weatherSlices/currentQueryError"
import { useLazyGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"
import { useSearchCitiesQuery } from "@/store/api/geoApi/geoApi"

import { Button } from '../ui/button'
import { Input } from "../ui/input"
import { buttonAnimation, autocompleteInput } from "@/lib/styles"
import { MapPin } from "lucide-react"

import type { AppDispatch, RootState } from '@/store'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

const WeatherInput = () => {
  const [inputCity, setInputCity] = useState<string>('')
  const [queryCity, setQueryCity] = useState<string>('')
  const [debouncedInput, setDebouncedInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const currentTheme = useSelector((state: RootState) => state.settings.selectedTheme)

  const dispatch = useDispatch<AppDispatch>()
  const [getCurrentQueryWeather] = useLazyGetCurrentWeatherQuery()
  
  const { data, isFetching, error } = useSearchCitiesQuery(
    { q: debouncedInput, limit: 15 },
    { skip: !debouncedInput.trim() } // не делать запрос, если нет ввода
  );

  console.log(debouncedInput)
    
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

  const debouncedSetInput = useCallback(
    debounce((value) => {
      setDebouncedInput(value)
    }, 
    150), []
  )

  useEffect(() => {
    if (inputCity.length === 0) {
      dispatch(clearQueryError())
    }

    if (debouncedInput.trim()) {
      setShowSuggestions(true)
    }

    if (!inputCity.trim()) {
      setShowSuggestions(false)
    }

    debouncedSetInput(inputCity)
  }, [inputCity])

  console.log(showSuggestions)

  if (queryCity) {
    return (
      <div className="p-2 flex items-center justify-between mx-8 mr-auto">
        <div className="flex gap-1">
          {/* <img 
            className='w-7 h-7'
            src={currentTheme === 'dark'
             ? 
             'src/context/icons/location-pointer-white.svg' 
             : 'src/context/icons/location-pointer-black.svg'} 
            alt="Location"
          /> */}
          <MapPin className="size-5 my-1"/>
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
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={inputCity}
          onChange={(e) => {setInputCity(e.target.value)}}
          onClick={() => {
            setInputCity('')
            dispatch(clearCity())
            dispatch(clearQueryError())
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Введите город..."
          className="border p-2 rounded"
        />
        
        {/* {isFetching && <p>Поиск...</p>} */}
        {error && <p style={{ color: 'red' }}>Ошибка: {(error as any).status}</p>}

        {showSuggestions && data && data.length > 0 && (
          <ul className={autocompleteInput}>
            {data.map((city, index) => {
              
              console.log(city)
              return (
              <li
                key={index}
                onClick={() => {
                  setInputCity(city.name);
                  setDebouncedInput('')
                  setShowSuggestions(false);
                  dispatch(setCity(city.name))
                }}
                className="p-2 cursor-pointer border-b-1"
              >
                {city.name === 'RU' ? city.local_names?.ru : city.name}, {city.country} 
                {/* {city.state && `(${city.state})`} */}
              </li>
            )})}
          </ul>
        )}

        {showSuggestions && data && data.length === 0 && !isFetching && (
          <div className={`${autocompleteInput} py-2`}>
            Нет совпадений
          </div>
        )}

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