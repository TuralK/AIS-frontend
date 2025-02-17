// settingsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { fetchInfo, updateUserInfo } from '../thunks/settingsThunk'

const initialState = {
  userData: null,
  loading: false,
  error: null,
  success: false
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInfo.fulfilled, (state, action) => {
        state.loading = false
        state.userData = {
          ...action.payload,
          username: action.payload.username || `${action.payload.firstName} ${action.payload.lastName}`
        }
      })
      .addCase(fetchInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.data.error
      })
      
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateUserInfo.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  }
})

export const { resetState } = settingsSlice.actions
export default settingsSlice.reducer