import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { type WeatherData, type GeocodeData, type HourlyForecast, type DailyForecast, type WeatherForecastResponse } from './types'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Weather', 'Geocode', 'Forecast'],
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherData, string>({
      query: (city) => 
        `/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`,
      providesTags: ['Weather'],
      keepUnusedDataFor: 84600
    }),
    getHourlyForecast: builder.query<HourlyForecast[], { lat: number; lon: number }>({
      query: ({ lat, lon }) => {
        if (!process.env.REACT_APP_OPENWEATHER_API_KEY) {
          throw new Error('API key missing');
        }
        return `onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
      },
      transformResponse: (response: WeatherForecastResponse) => response.hourly.slice(0, 24), // Берем только 24 часа
      providesTags: ['Forecast'],
    }),

    // Полный прогноз (почасовой + ежедневный)
    getFullForecast: builder.query<WeatherForecastResponse, { lat: number; lon: number }>({
      query: ({ lat, lon }) => {
        if (!process.env.REACT_APP_OPENWEATHER_API_KEY) {
          throw new Error('API key missing');
        }
        return `onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
      },
      providesTags: ['Forecast'],
    }),

    // Ежедневный прогноз на 7 дней
    getDailyForecast: builder.query<DailyForecast[], { lat: number; lon: number }>({
      query: ({ lat, lon }) => {
        if (!process.env.REACT_APP_OPENWEATHER_API_KEY) {
          throw new Error('API key missing');
        }
        return `onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`;
      },
      transformResponse: (response: WeatherForecastResponse) => response.daily,
      providesTags: ['Forecast'],
    }),
    // getWeatherByCoords: builder.query<WeatherData, { lat: number; lon: number }>({
    //   query: ({ lat, lon }) =>
    //     `/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`,
    //   providesTags: ['Weather'],
    // }),
    searchCities: builder.query<GeocodeData[], string>({
      query: (searchQuery) => {
        if (!API_KEY) throw new Error('API key missing')
        return `/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${API_KEY}`
      },
      providesTags: ['Geocode'],
    }),
  })
})

export const { 
  useGetCurrentWeatherQuery, 
  useLazyGetCurrentWeatherQuery,
  useSearchCitiesQuery,
  useGetHourlyForecastQuery,
  useGetFullForecastQuery,
  useGetDailyForecastQuery,
  // useGetWeatherByCoordsQuery 
} = weatherApi