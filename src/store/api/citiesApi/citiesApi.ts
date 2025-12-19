// // src/store/api/citiesApi.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// // Типы
// export interface City {
//   id: number;
//   name: string;
//   country: string;
//   coord: { lat: number; lon: number };
// }

// export interface GetCitiesResponse {
//   city: City[];
//   total: number;
//   page: number;
//   limit: number;
// }

// // Создаём API-слайс
// export const citiesApi = createApi({
//   reducerPath: 'citiesApi',
//   baseQuery: fetchBaseQuery({ baseUrl: '/data/' }), // ваш путь к файлу
//   endpoints: (builder) => ({
//     getCities: builder.query<GetCitiesResponse, { page?: number; limit?: number; q?: string }>({
//       query: ({ page = 1, limit = 100, q = '' }) => {
//         // Так как мы работаем с JSON-файлом, нам нужно сымитировать пагинацию и поиск на клиенте
//         // Поэтому мы просто запрашиваем весь файл
//         return `city.list.ru.json`;
//       },
//       transformResponse: (response: City[], _meta, { page = 1, limit = 100, q = '' }) => {
//         let filtered = response;

//         if (q) {
//           filtered = response.filter(city => city.name.toLowerCase().includes(q.toLowerCase()));
//         }

//         const start = (page - 1) * limit;
//         const end = start + limit;
//         const paginated = filtered.slice(start, end);

//         return {
//           data: paginated,
//           total: filtered.length,
//           page,
//           limit,
//         };
//       },
//       keepUnusedDataFor: 600, // кэшируем данные 10 минут
//     }),
//   }),
// });

// export const { useGetCitiesQuery } = citiesApi;