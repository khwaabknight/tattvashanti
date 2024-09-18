import { configureStore } from '@reduxjs/toolkit'
import userSlice from '@/store/features/userSlice'
import dishesSlice from './features/dishesSlice'
import cuisinesSlice from './features/cuisinesSlice'
// import tasksSlice from './features/task/tasksSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    dishes: dishesSlice,
    cuisines : cuisinesSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch