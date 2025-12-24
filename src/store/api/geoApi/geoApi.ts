// src/store/api/geoApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface GeoResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const API_KEY = import.meta.env.VITE_SEARCHCITY_API_KEY

export const geoApi = createApi({
  reducerPath: 'geoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openweathermap.org/geo/1.0/' }),
  endpoints: (builder) => ({
    searchCities: builder.query<GeoResult[], { q: string; limit?: number }>({
      query: ({ q, limit = 10 }) => {
        const params = new URLSearchParams({
          q,
          limit: limit.toString(),
          appid: API_KEY, // замените на ваш API-ключ
        });
        return `direct?${params}`;
      },
      // Дебаунс на уровне RTK Query (необязательно, можно в компоненте)
      keepUnusedDataFor: 60, // кэшируем результаты на 60 секунд
    }),
  }),
});

export const { useSearchCitiesQuery } = geoApi;