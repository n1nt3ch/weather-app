import { useTheme } from "@/context/theme-provider"
import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { cn } from "@/lib/utils/cn.ts"

import { Settings, AlertCircleIcon } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Label } from "../ui/label"
import { Button } from "../ui/button"

import type { AppDispatch } from '@/store'
import type { RootState } from "@/store"

import { 
  setDarkTheme, setLightTheme, 
  setTempC, setTempF, 
  setPressureMm, setPressureHpa 
} from "@/store/slices/settingsSlice.ts"
import { clearQueryError } from "@/store/slices/weatherSlices/currentQueryError.ts"

import WeatherInput from './WeatherInput.tsx'
import { isDark } from "@/lib/utils/otherFunc.ts"
import { buttonAnimation } from "@/lib/styles.ts"

const Header = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>()

  const currentTemp = useSelector((state: RootState) => state.settings.selectedTemp)
  const currentPressure = useSelector((state: RootState) => state.settings.selectedPressure)
  const weatherError = useSelector((state: RootState) => state.queryError.currentQueryError)

  // const handleClick = () => settings === 'closed' ? setSettings('opened') : setSettings('closed')

  // const settingsBtn = cn(
  //   settings === 'closed' ? 'rotate-0' : 'rotate-180'
  // )

  useEffect(() => {
      if (isDark(theme)) {
        dispatch(setDarkTheme());
      } else {
        dispatch(setLightTheme());
      }
  }, [isDark(theme), dispatch])
  
  return (
    <header 
      className="sticky top-0 z-50  border-b border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] 
      bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/30"
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
          <img src={isDark(theme) ? 'src/context/icons/weather-logo(dark).png' : 'src/context/icons/weather-logo(light).png'} 
          alt="Weather app logo" 
          className="h-14"/>
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
              <Button className={`${buttonAnimation} flex items-center cursor-pointer rounded-full w-9`}><Settings className="size-6"/></Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">Настройки</h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="theme">Тема</Label>
                    <Select onValueChange={(value) => value === 'light' ? setTheme('light') : setTheme('dark')} defaultValue={theme}>
                      <SelectTrigger>
                        <SelectValue placeholder='Выберите тему'/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='light'>светлая</SelectItem>
                          <SelectItem value='dark'>темная</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="temperature">Температура</Label>
                    <Select onValueChange={(value) => value === 'c' ? dispatch(setTempC()) : dispatch(setTempF())} defaultValue={currentTemp}>
                      <SelectTrigger>
                        <SelectValue placeholder='Выберите единицу'/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='c'>°C</SelectItem>
                          <SelectItem value='f'>°F</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="pressure">Давление</Label>
                    <Select onValueChange={(value) => value === 'mm' ? dispatch(setPressureMm()) : dispatch(setPressureHpa())} defaultValue={currentPressure}>
                      <SelectTrigger>
                        <SelectValue placeholder='Выберите единицу'/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='mm'>мм.рт.ст</SelectItem>
                          <SelectItem value='hpa'>гПа</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}

export default Header
