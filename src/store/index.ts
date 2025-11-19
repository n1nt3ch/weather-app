import { configureStore } from '@reduxjs/toolkit'
import { weatherApi } from './api/weatherApi/weatherApi'
import { forecastApi } from './api/forecastApi/forecastApi'
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(weatherApi.middleware)
      .concat(forecastApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch