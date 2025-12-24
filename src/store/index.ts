import { configureStore } from '@reduxjs/toolkit'
import { weatherApi } from './api/weatherApi/weatherApi'
import { forecastApi } from './api/forecastApi/forecastApi'
import { geoApi } from './api/geoApi/geoApi'
import { rainApi } from './api/rainApi/rainApi'
import { newsApi } from './api/newsApi/newsApi'
import currentCitySlice from './slices/weatherSlices/currentCitySlice'
import currentQueryError from './slices/weatherSlices/currentQueryError'
import currentSettingsSlice from './slices/settingsSlice'

export const store = configureStore({
  reducer: {
    city: currentCitySlice,
    queryError: currentQueryError,
    settings: currentSettingsSlice,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [forecastApi.reducerPath]: forecastApi.reducer,
    [rainApi.reducerPath]: rainApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [geoApi.reducerPath]: geoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(weatherApi.middleware)
      .concat(forecastApi.middleware)
      .concat(rainApi.middleware)
      .concat(newsApi.middleware)
      .concat(geoApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch