import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { HourlyForecast, WeatherForecastResponse, DailyForecast } from './types';

// const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
// const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const forecastApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Forecast'],
  endpoints: (builder) => ({

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
  })
})

export const { 
  useGetHourlyForecastQuery,
  useGetFullForecastQuery,
  useGetDailyForecastQuery,
  // useGetWeatherByCoordsQuery 
} = forecastApi