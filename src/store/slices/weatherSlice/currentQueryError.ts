import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface QueryErrorState {
  currentQueryError: string
}

const initialState: QueryErrorState = {
  currentQueryError: '',
}

export const currentQueryError = createSlice({
  name: 'queryError',
  initialState,
  reducers: {
    setQueryError: (state, action: PayloadAction<string>) => {
      state.currentQueryError = action.payload
    },
    clearQueryError : (state) => {
      state.currentQueryError = ''
    },
  },
})

export const { setQueryError, clearQueryError  } = currentQueryError.actions
export default currentQueryError.reducer