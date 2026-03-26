import { useState, useMemo, useCallback, useEffect, type FormEvent } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils/cn"
import { debounce } from 'lodash'

import { setCity, clearCity } from '@/store/slices/weatherSlices/currentCitySlice'
import { setQueryError, clearQueryError } from "@/store/slices/weatherSlices/currentQueryError"
import { useLazyGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"
import { useSearchCitiesQuery } from "@/store/api/geoApi/geoApi"

import { Button } from '../ui/button'
import { Input } from "../ui/input"
import { buttonAnimation, autocompleteInput, autocompleteInputDark, autocompleteInputLight } from "@/lib/styles"
import { MapPin } from "lucide-react"

import type { AppDispatch, RootState } from '@/store'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'
import { isDark } from "@/lib/utils/otherFunc"

const WeatherInput = () => {
  const [inputCity, setInputCity] = useState<string>('')
  const [debouncedInput, setDebouncedInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const [getCurrentQueryWeather] = useLazyGetCurrentWeatherQuery()
  
  const { data, isFetching, error } = useSearchCitiesQuery(
    { q: debouncedInput, limit: 15 },
    { skip: !debouncedInput.trim() } // не делать запрос, если нет ввода
  );

  const currentTheme = useSelector((state: RootState) => state.settings.selectedTheme)
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
    
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

  const loadingSpin = () => {
    const styles = {
      wrapper: cn(currentTheme === 'light' ? 'bg-blue-100/50': 'bg-neutral-800/50'),
    }

    return createPortal(
      <div className={`${styles.wrapper} fixed inset-0 flex items-center justify-center z-9999 p-4 cursor-pointer`}>
        <div className="flex flex-col gap-4 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh]">
          <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6 text-slate-900">
            <section className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white p-8 text-center shadow-2xl backdrop-blur">
              <div className="mx-auto mb-5 size-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
              <h2 className="text-2xl">Загружаем погоду...</h2>
              <p className="mt-2 text-sm text-slate-600">Пожалуйста, подождите.</p>
            </section>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  const debouncedSubmit = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value.trim()) return;

        setIsLoading(true)

        const result = await getCurrentQueryWeather(value);

        if (result.data) {
          dispatch(setCity(result.data.name));
        }

        if (result.error) {
          const errorMsg = getErrorMessage(result.error);
          dispatch(setQueryError(errorMsg));
        }

        setIsLoading(false)
      }, 500),
    [getCurrentQueryWeather, dispatch]
  );

  useEffect(() => () => debouncedSubmit.cancel(), [debouncedSubmit]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      debouncedSubmit(inputCity);
    },
    [inputCity, debouncedSubmit]
  );
  
  const handleEditCity = () => {
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

    if (inputCity.trim().length === 0) {
      setShowSuggestions(false)
    }

    debouncedSetInput(inputCity)
  }, [inputCity])

  if (currentCity) {
    return (
      <div className="p-2 flex items-center justify-between mx-8 mr-auto">
        <div className="flex gap-1">
          <MapPin className="size-5 my-1  "/>
          <span className={cn("text-2xl font-semibold cursor-pointer  tracking-tight ",
            isDark(currentTheme) ? 
            'text-slate-100/95 font-semibold tracking-tight [text-shadow:0_1px_0_rgba(15,23,42,0.45),0_8px_24px_rgba(2,6,23,0.4)]' :
            'text-slate-950/90  [text-shadow:0_1px_0_rgba(255,255,255,0.22),0_6px_20px_rgba(15,23,42,0.22)]'
          )}
          onClick={handleEditCity}>
            {currentCity}
          </span>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return loadingSpin()
  }
  
  return (
    <div className="flex items-center ml-8 mr-auto">
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
          placeholder="Введите город..."
          className="border p-2 rounded"
        />
        
        {/* {isFetching && <p>Поиск...</p>} */}
        {error && <p style={{ color: 'red' }}>Ошибка: {(error as any).status}</p>}

        {showSuggestions && data && data.length > 0 && (
          <ul className={autocompleteInput}>
            {data.map((city, index) => {
              return (
              <li
                key={index}
                onClick={() => {
                  setInputCity(city.name);
                  setDebouncedInput('')
                  setShowSuggestions(false);
                  dispatch(setCity(city.name))
                }}
                className={`${isDark(currentTheme) ? autocompleteInputDark : autocompleteInputLight} p-2 cursor-pointer border-b-1`}
              >
                {city.name === 'RU' ? city.local_names?.ru : city.name}, {city.country} 
              </li>
            )})}
          </ul>
        )}

        {showSuggestions && data && data.length === 0 && !isFetching && error && (
          <div className={`
            ${isDark(currentTheme) ? autocompleteInputDark : autocompleteInputLight} 
            ${autocompleteInput}
            p-2`}
          >
            Нет совпадений
          </div>
        )}

        <Button 
          type="submit"
          className={`${buttonAnimation} p-3 rounded cursor-pointer`}
          disabled={!inputCity.trim()}
        >
          Найти
        </Button>
      </form>
    </div>
  )
}
export default WeatherInput