import { createAsyncThunk } from '@reduxjs/toolkit';
import { getConversations, getConversationMessages, createConversation, deleteConversation, sendMessageApi, getUsers, deleteMessage } from '../api/messageApi';

// To fetch all conversations of user
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

// To fetch messages of a conversation with using conversationId parameter
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

// To create a conversation
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

// To delete a conversation
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

// To send a message
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

// To fetch users
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

// To delete a message
export const deleteMessageThunk = createAsyncThunk(
    "messaging/deleteMessage",
    async ({ apiUrl, messageId }, thunkAPI) => {
        try {
            const result = await deleteMessage(apiUrl, messageId);
            //thunkAPI.dispatch(fetchConversationMessagesThunk({ apiUrl, conversationId }));
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);