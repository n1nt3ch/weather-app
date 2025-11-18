import { useTheme } from "@/context/theme-provider"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom"

import { Moon, Sun, Settings, AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

import type { AppDispatch } from '@/store'
import type { RootState } from "@/store"

import { setDarkTheme, setLightTheme } from "@/store/slices/themeSlice/themeSlice.ts"
import { clearQueryError } from "@/store/slices/weatherSlice/currentQueryError.ts"

import WeatherInput from './WeatherInput.tsx'
import { buttonAnimation } from "@/lib/styles.ts"
import { cn } from "@/lib/utils/cn.ts"

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState('closed');
  const isDark = theme === 'dark';
  const dispatch = useDispatch<AppDispatch>()

  const weatherError = useSelector((state: RootState) => state.queryError.currentQueryError)

  const handleClick = () => settings === 'closed' ? setSettings('opened') : setSettings('closed')

  const settingsBtn = cn(
    settings === 'closed' ? 'rotate-180' : 'rotate-0'
  )

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
          <Popover>
            <PopoverTrigger asChild>
              <button onClick={handleClick} className={`${settingsBtn} flex items-center cursor-pointer transition-transform duration-500`}><Settings /></button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">Dimensions</h4>
                  <p className="text-muted-foreground text-sm">
                    Set the dimensions for the layer.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      defaultValue="100%"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">Max. width</Label>
                    <Input
                      id="maxWidth"
                      defaultValue="300px"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      defaultValue="25px"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxHeight">Max. height</Label>
                    <Input
                      id="maxHeight"
                      defaultValue="none"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`flex items-center cursor-pointer transition-transform duration-500
            ${isDark ? 'rotate-180' : 'rotate-0'}`}
          >
            {isDark ? (
                <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all"></Sun>
              ) : (
                <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all"></Moon>
              )}
          </button> */}
        </div>
      </div>
    </header>
  )
}

export default Header
