import { createAsyncThunk } from "@reduxjs/toolkit"
import { sendMessageApi, getMessagesApi, createConversation, getConversation } from '../api/aiChatApi';

export const sendMessageToAI = createAsyncThunk(
    
    "aiMessages/sendMessage",
    async ({ message, apiUrl, conversationId }, { dispatch, rejectWithValue }) => {
      try {
        const response = await sendMessageApi(apiUrl, message, conversationId);
  
        // Eğer hata oluşmadıysa, mesaj geçmişini güncellemek için getMessages thunk'unu tetikleyelim.
        dispatch(getMessages({ apiUrl, conversationId }));
  
        return {
          userMessage: response.userMessage,
          aiMessage: response.aiMessage,
        };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Unknown error");
      }
    }
  );
  

export const getMessages = createAsyncThunk(
    "aiMessages/getMessages",
    async ({ apiUrl, conversationId }, { rejectWithValue }) => {
        try {
            const response = await getMessagesApi(apiUrl, conversationId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Unknown error");
        }
    }
);

export const createConversationThunk = createAsyncThunk(
    "conversation/create",
    async (apiUrl, { rejectWithValue }) => {
        try {
            const data = await createConversation(apiUrl);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);


export const getConversationThunk = createAsyncThunk(
    "conversation/get",
    async (apiUrl, { rejectWithValue }) => {
        try {
            const data = await getConversation(apiUrl);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);