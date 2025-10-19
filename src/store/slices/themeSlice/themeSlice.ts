import { createSlice } from '@reduxjs/toolkit'

interface ThemeState {
  selectedTheme: string
}

const initialState: ThemeState = {
  selectedTheme: '',
}

export const currentTheme = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkTheme: (state) => {
      state.selectedTheme = 'dark'
    },
    setLightTheme: (state) => {
      state.selectedTheme = 'light'
    },
  },
})

export const { setDarkTheme, setLightTheme } = currentTheme.actions
export default currentTheme.reducer