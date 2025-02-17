import { getInfo, updateUserInfoApi } from '../api/settingsApi'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

export const fetchInfo = createAsyncThunk(
    'settings/fetchAdminInfo',
    async (apiUrl, { rejectWithValue }) => {
        try {
            const response = await getInfo(apiUrl)
            return response
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateUserInfo = createAsyncThunk(
    'settings/updateUserInfo',
    async ({ apiUrl, formData }, { rejectWithValue }) => {
        try {
            const payload = {
                ...formData,
                newPassword: formData.password,
                confirmPassword: formData.confirmPassword
              }

            const response = await updateUserInfoApi(apiUrl, payload)
            await fetchInfo(apiUrl)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data.error)
        }
    }
)
