// services/rainApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Типы
export interface RadarItem {
  time: number; // Unix timestamp
  path: string; // путь для тайлов
}

export interface RainViewerResponse {
  radar: {
    past: RadarItem[];
    nowcast?: RadarItem[]; // прогноз (может отсутствовать)
  };
}

export interface RainTileUrls {
  current: string;      // текущая карта осадков
  forecast: string[];   // массив URL для прогноза (на 2 часа вперёд)
}

// Базовый URL тайлов
const TILE_BASE = 'https://tilecache.rainviewer.com';

// Формат тайла: {path}/{z}/{x}/{y}/2/1_1.png
const buildTileUrl = (path: string) => `${TILE_BASE}${path}/{z}/{x}/{y}/2/1_1.png`;

export const rainApi = createApi({
  reducerPath: 'rainApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.rainviewer.com' }),
  endpoints: (builder) => ({
    // Получаем метаданные (пути к тайлам)
    getRainViewerData: builder.query<RainTileUrls, void>({
      query: () => '/public/weather-maps.json',
      transformResponse: (response: RainViewerResponse): RainTileUrls => {
        const { past, nowcast } = response.radar;

        // Текущая карта — самый свежий из past[0]
        const current = past.length > 0 ? buildTileUrl(past[0].path) : '';

        // Прогноз — до 24 шагов (~2 часа)
        const forecast = (nowcast || []).map(item => buildTileUrl(item.path));

        return { current, forecast };
      },
      // Кэшировать 5 минут — данные обновляются каждые ~10 минут
      keepUnusedDataFor: 5 * 60, // секунды
    }),
  }),
});

export const { useGetRainViewerDataQuery } = rainApi;