import { createAsyncThunk } from "@reduxjs/toolkit"
import { sendMessageApi, getMessagesApi } from '../api/aiChatApi';

export const sendMessageToAI = createAsyncThunk(
    "aiMessages/sendMessage",
    async ({ message, apiUrl }, { rejectWithValue }) => {
        try {
            const response = await sendMessageApi(apiUrl, message);
            return {
                aiMessage: response.data.response
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error")
        }
    }
)

export const getMessages = createAsyncThunk(
    "aiMessages/getMessages",
    async (apiUrl, { rejectWithValue }) => {
        try {
            const response = await getMessagesApi(apiUrl);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error")
        }
    }
)