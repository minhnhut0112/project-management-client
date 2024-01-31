import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    auth: null
  },
  reducers: {
    loginUser: (state, action) => {
      state.auth = action.payload
    },
    logoutUser: (state) => {
      state.auth = null
    }
  }
})

export const { loginUser, logoutUser } = userSlice.actions

export default userSlice.reducer
