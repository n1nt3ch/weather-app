import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { type WeatherData, type GeocodeData } from './types'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Weather', 'Geocode'],
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherData, string>({
      query: (city) => 
        `/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`,
      providesTags: ['Weather'],
      keepUnusedDataFor: 84600
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
  }),
})

export const { 
  useGetCurrentWeatherQuery, 
  useLazyGetCurrentWeatherQuery,
  useSearchCitiesQuery
  // useGetWeatherByCoordsQuery 
} = weatherApi