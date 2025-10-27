import { useTheme } from "@/context/theme-provider"
import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Moon, Sun } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { Button } from '../ui/button'

import type { AppDispatch } from '@/store'
import type { RootState } from "@/store"

import { setDarkTheme, setLightTheme } from "@/store/slices/themeSlice/themeSlice.ts"
import { clearQueryError } from "@/store/slices/weatherSlice/currentQueryError.ts"

import WeatherInput from './WeatherInput.tsx'

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const dispatch = useDispatch<AppDispatch>()

  const weatherError = useSelector((state: RootState) => state.queryError.currentQueryError)
  
  useEffect(() => {
      if (isDark) {
        dispatch(setDarkTheme());
      } else {
        dispatch(setLightTheme());
      }
    }, [isDark, dispatch])
  
  return (
    <header className="sticky top-0 border-b z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to={'/'}>
          <img src={isDark ? 'src/context/icons/weather-logo(dark).png' : 'src/context/icons/weather-logo(light).png'} 
          alt="Weather app logo" 
          className="h-14"/>
        </Link>
        <WeatherInput/>
        {weatherError && 
          <Alert onClick={() => dispatch(clearQueryError())} variant="destructive" 
            // className="w-80 position absolute left-1/2 top-1 transform -translate-x-1/2 bg-accent"
            className="w-80 animate-in fade-in-0 zoom-in-95 slide-in-from-top-0 duration-500 
              position absolute left-1/2 top-1 transform -translate-x-1/2 bg-accent cursor-pointer"
            >
            <AlertCircleIcon className="h-4 w-4"/>
            <AlertTitle className="flex justify-between">
              Ошибка
            </AlertTitle>
            <AlertDescription>
              {weatherError}
            </AlertDescription>
          </Alert>
        }
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
