import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
  time:1
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state, action) => {
      state.value =  action.payload
    },
    decrement: (state) => {
      state.time -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer