import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_KEY = import.meta.env.VITE_FORECASTWEATHER_API_KEY
export const forecastApi = createApi({
  reducerPath: 'forecastApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://api.openweathermap.org/data/2.5/',
  }),
  tagTypes: ['Forecast'],
  endpoints: (builder) => ({
    // 5-Day / 3-Hour Forecast (БЕСПЛАТНЫЙ)
    get5DayForecast: builder.query<any[], { lat: number; lon: number }>({
      query: ({ lat, lon }) => {
        if (!API_KEY) throw new Error('API key missing');
        return `forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ru`;
      },
      transformResponse: (response: any) => response.list || [],
    }),

    // One Call API 3.0 (частично бесплатный - требует активации)
    getOneCallForecast: builder.query<any, { lat: number; lon: number }>({
      query: ({ lat, lon }) => {
        if (!API_KEY) throw new Error('API key missing');
        return `onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}&lang=ru`;
      },
    }),
  })
})

export const { 
  useGet5DayForecastQuery,
  useGetOneCallForecastQuery,
} = forecastApi