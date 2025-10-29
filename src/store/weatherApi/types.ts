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

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // Probability of precipitation
}

export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: number;
  pop: number;
  uvi: number;
  rain?: number;
  snow?: number;
}

export interface WeatherForecastResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current?: any;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}