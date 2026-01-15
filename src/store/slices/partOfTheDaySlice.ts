import { createSlice } from '@reduxjs/toolkit'

interface DayState {
  currentPart: string,
}

const initialState: DayState = {
  currentPart: '',
}

export const currentDayPart = createSlice({
  name: 'partOfTheDay',
  initialState,
  reducers: {
    setDayPart: (state) => {
      state.currentPart = 'day'
    },
    setNightPart: (state) => {
      state.currentPart = 'night'
    },
  },
})

export const { setDayPart, setNightPart } = currentDayPart.actions
export default currentDayPart.reducer