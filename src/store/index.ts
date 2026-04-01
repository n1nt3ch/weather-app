import { configureStore } from '@reduxjs/toolkit'
import { weatherApi } from './api/weatherApi/weatherApi'
import { forecastApi } from './api/forecastApi/forecastApi'
import { geoApi } from './api/geoApi/geoApi'
import currentCitySlice from './slices/weatherSlices/currentCitySlice'
import currentQueryError from './slices/weatherSlices/currentQueryError'
import currentSettingsSlice from './slices/settingsSlice'
import currentDayPart  from './slices/partOfTheDaySlice'

export const store = configureStore({
  reducer: {
    city: currentCitySlice,
    queryError: currentQueryError,
    settings: currentSettingsSlice,
    dayPart: currentDayPart,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [forecastApi.reducerPath]: forecastApi.reducer,
    [geoApi.reducerPath]: geoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(weatherApi.middleware)
      .concat(forecastApi.middleware)
      .concat(geoApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch