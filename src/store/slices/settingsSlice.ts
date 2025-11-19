import { createSlice } from '@reduxjs/toolkit'

interface ThemeState {
  selectedTheme: string,
  selectedTemp: string,
  selectedPressure: string,
}

const initialState: ThemeState = {
  selectedTheme: 'light',
  selectedTemp: 'c',
  selectedPressure: 'mm',
}

export const currentSettings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkTheme: (state) => {
      state.selectedTheme = 'dark'
    },
    setLightTheme: (state) => {
      state.selectedTheme = 'light'
    },
    setTempC: (state) => {
      state.selectedTemp = 'c'
    },
    setTempF: (state) => {
      state.selectedTemp = 'f'
    },
    setPressureMm: (state) => {
      state.selectedPressure = 'm'
    },
    setPressureHpa: (state) => {
      state.selectedPressure = 'hpa'
    },
  },
})

export const { setDarkTheme, setLightTheme, setTempC, setTempF, setPressureMm, setPressureHpa } = currentSettings.actions
export default currentSettings.reducer