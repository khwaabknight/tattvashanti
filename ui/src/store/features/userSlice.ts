import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type UserType = {
  _id: string,
  name: string,
  email: string,
  createdAt: string,
  updatedAt: string,
}

export type UserState = {
  user: UserType | null,
}

const initialState: UserState = {
  user: localStorage.getItem('tattvaShantiUser') ? JSON.parse(localStorage.getItem('tattvaShantiUser') as string) : null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action:PayloadAction<UserState>) => {
      state.user = action.payload.user
    },
    resetUser: (state) => {
      state.user = null
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, resetUser } = userSlice.actions

export default userSlice.reducer