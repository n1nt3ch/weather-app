export interface WeatherData {
  // name: string
  // main: {
  //   temp: number
  //   feels_like: number
  //   humidity: number
  //   pressure: number
  // }
  // weather: Array<{
  //   main: string
  //   description: string
  //   icon: string
  // }>
  // wind: {
  //   speed: number
  // }
  // sys: {
  //   country: string
  // }
  coord: {
    lon: number  // Долгота
    lat: number  // Широта
  }
  weather: Array<{
    id: number           // Код погодных условий
    main: string         // Группа параметров (Rain, Snow, Clouds и т.д.)
    description: string  // Описание на человеческом языке
    icon: string         // Иконка
  }>
  main: {
    temp: number       // Температура
    feels_like: number // Ощущается как
    pressure: number   // Атмосферное давление (hPa)
    humidity: number   // Влажность (%)
    temp_min?: number  // Минимальная температура
    temp_max?: number  // Максимальная температура
    sea_level?: number // Давление на уровне моря
    grnd_level?: number // Давление на уровне земли
  }
  visibility: number   // Видимость (метры)
  wind: {
    speed: number     // Скорость ветра (м/с)
    deg: number       // Направление ветра (градусы)
    gust?: number     // Порывы ветра (м/с)
  }
  clouds: {
    all: number       // Облачность (%)
  }
  rain?: {
    "1h": number      // Дождь за последний час (мм)
    "3h": number      // Дождь за последние 3 часа (мм)
  }
  snow?: {
    "1h": number      // Снег за последний час (мм)
    "3h": number      // Снег за последние 3 часа (мм)
  }
  dt: number          // Время расчета данных (Unix timestamp)
  sys: {
    country: string   // Код страны
    sunrise: number   // Время восхода (Unix timestamp)
    sunset: number    // Время заката (Unix timestamp)
  }
  timezone: number    // Смещение времени от UTC (секунды)
  name: string        // Название города
}

export interface GeocodeData {
  name: string
  local_names?: {
    [key: string]: string
  }
  lat: number
  lon: number
  country: string
  state?: string
}