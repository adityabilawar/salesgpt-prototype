import { createSlice } from '@reduxjs/toolkit'

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    view: 'PROFILE',
  },
  reducers: {
    setView: (state, action) => {
      state.view = action.payload
    },
  },
})

export const { setView } = sidebarSlice.actions

export default sidebarSlice.reducer
