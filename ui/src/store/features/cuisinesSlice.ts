import { CuisineType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type CuisineState = {
    cuisines: CuisineType[],
}

const initialState: CuisineState = {
    cuisines: [],
}

export const cuisinesSlice = createSlice({
  name: 'cuisines',
  initialState,
  reducers: {
    setCuisines: (state, action:PayloadAction<CuisineState>) => {
      state.cuisines = action.payload.cuisines
    },
    resetCuisines: (state) => {
      state.cuisines = []
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCuisines, resetCuisines } = cuisinesSlice.actions
export default cuisinesSlice.reducer