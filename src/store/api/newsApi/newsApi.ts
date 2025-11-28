// src/store/api/newsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Article, NewsResponse } from './types';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://newsapi.org/v2', // ✅ Убраны лишние пробелы
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_NEWSAPI_KEY}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<NewsResponse, { country: string; category: string; language: string }>({
      query: ({ country = 'ru', category = '', language = '' }) => {
        const params = new URLSearchParams();
        if (country) params.append('country', country);
        if (category) params.append('category', category);
        if (language) params.append('language', language); // 🔥 Добавлено
        return `/top-headlines?${params}`;
      },
      keepUnusedDataFor: 60 * 5,
    }),
    getNewsByQuery: builder.query<NewsResponse, { q: string }>({
      query: ({ q }) => `/everything?q=${encodeURIComponent(q)}`,
      keepUnusedDataFor: 60 * 5,
    }),
  }),
});

export const { useGetTopHeadlinesQuery, useGetNewsByQueryQuery } = newsApi;