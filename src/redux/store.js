import { configureStore } from '@reduxjs/toolkit'
import userSile from './userSile'

export const store = configureStore({
  reducer: {
    user: userSile
  }
})
