import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { GeocodeData } from './types'

// const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY ----- Требуется изменить апикей и юрл!!!
// const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const geocodingApi = createApi({
  reducerPath: 'geocodingApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Geocode'],
  endpoints: (builder) => ({
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
  useSearchCitiesQuery,
} = geocodingApi