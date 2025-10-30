import { configureStore } from '@reduxjs/toolkit'
import { weatherApi } from './weatherApi/weatherApi'
import { forecastApi } from './forecastApi/forecastApi'
import currentCitySlice from './slices/weatherSlice/currentCitySlice'
import currentQueryError from './slices/weatherSlice/currentQueryError'
import currentThemeSlice from './slices/themeSlice/themeSlice'

export const store = configureStore({
  reducer: {
    city: currentCitySlice,
    queryError: currentQueryError,
    theme: currentThemeSlice,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [forecastApi.reducerPath]: forecastApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(weatherApi.middleware, forecastApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch