import { DishType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type DishState = {
    dishes: DishType[],
}

const initialState: DishState = {
  dishes: [],
}

export const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    setDishes: (state, action:PayloadAction<DishState>) => {
      state.dishes = action.payload.dishes
    },
    resetDishes: (state) => {
      state.dishes = []
    },
    addDish: (state, action:PayloadAction<DishType>) => {
      const newDishes = [...state.dishes];
      newDishes.push(action.payload);
      state.dishes = newDishes;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setDishes, resetDishes, addDish } = dishesSlice.actions
export default dishesSlice.reducer