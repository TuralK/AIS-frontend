// src/redux/slices/messagingSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getConversations, getConversationMessages, createConversation, deleteConversation, sendMessageApi, getUsers } from '../api/messageApi';

// Konuşmaları çekmek için thunk
export const fetchConversationsThunk = createAsyncThunk(
    'messaging/fetchConversations',
    async (apiUrl, thunkAPI) => {
        try {
            const conversations = await getConversations(apiUrl);
            return conversations;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Belirli bir konuşmanın mesajlarını çekmek için thunk
export const fetchConversationMessagesThunk = createAsyncThunk(
    'messaging/fetchConversationMessages',
    async ({ apiUrl, conversationId }, thunkAPI) => {
        try {
            const messages = await getConversationMessages(apiUrl, conversationId);
            return { conversationId, messages };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Konuşma oluşturmak için thunk
export const createConversationThunk = createAsyncThunk(
    'messaging/createConversation',
    async ({ apiUrl, receiverEmail, receiverName }, thunkAPI) => {
        try {
            const newConversation = await createConversation(apiUrl, receiverEmail, receiverName);
            // Yeni konuşma oluşturulduktan sonra güncel konuşmaları çekebilirsiniz:
            thunkAPI.dispatch(fetchConversationsThunk(apiUrl));
            return newConversation;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Konuşma silmek için thunk
export const deleteConversationThunk = createAsyncThunk(
    'messaging/deleteConversation',
    async ({ apiUrl, conversationId }, thunkAPI) => {
        try {
            const result = await deleteConversation(apiUrl, conversationId);
            // Silme işleminden sonra güncel konuşmaları çekmek isteyebilirsiniz:
            thunkAPI.dispatch(fetchConversationsThunk(apiUrl));
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const sendMessageThunk = createAsyncThunk(
    'messages/sendMessage',
    async ({ apiUrl, conversationId, message, file = null }, thunkAPI) => {
        try {
            const data = await sendMessageApi(apiUrl, conversationId, message, file);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Kullanıcıları çekme thunk
export const fetchUsersThunk = createAsyncThunk(
    'messaging/fetchUsers',
    async (apiUrl, { rejectWithValue }) => {
        try {
            const data = await getUsers(apiUrl);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });