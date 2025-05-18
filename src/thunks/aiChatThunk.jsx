import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendMessageApi, getConversation } from '../api/aiChatApi';

export const getConversationThunk = createAsyncThunk(
  "aiMessages/getConversation",
  async (apiUrl, { rejectWithValue }) => {
    try {
      const data = await getConversation(apiUrl);
      
      return data.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const sendMessageToAI = createAsyncThunk(
  "aiMessages/sendMessage",
  async ({ message, apiUrl }, { dispatch, rejectWithValue }) => {
    try {
      const response = await sendMessageApi(apiUrl, message);
      
      //get the new messages
      await dispatch(getConversationThunk(apiUrl));
      return {
        userMessage: response.userMessage,
        aiMessage: response.aiMessage
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unknown error");
    }
  }
);
