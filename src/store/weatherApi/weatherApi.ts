import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { type WeatherData } from './types'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'



export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Weather'],
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherData, string>({
      query: (city) => 
        `/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`,
      providesTags: ['Weather'],
    }),
    getWeatherByCoords: builder.query<WeatherData, { lat: number; lon: number }>({
      query: ({ lat, lon }) =>
        `/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`,
      providesTags: ['Weather'],
    }),
  }),
})

export const { 
  useGetCurrentWeatherQuery, 
  useGetWeatherByCoordsQuery 
} = weatherApi