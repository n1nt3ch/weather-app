import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CityState {
  selectedCity: string
}

const initialState: CityState = {
  selectedCity: '',
}

export const currentCity = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload
    },
    clearCity : (state) => {
      state.selectedCity = ''
    },
  },
})

export const { setCity, clearCity  } = currentCity.actions
export default currentCity.reducer