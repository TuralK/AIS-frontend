import { createSlice } from '@reduxjs/toolkit';
import { fetchConversationsThunk, fetchConversationMessagesThunk, sendMessageThunk, fetchUsersThunk, markMessagesAsReadThunk } from '../thunks/messageThunks';

const initialState = {
  conversations: [],
  conversationMessages: {}, // conversationId bazında mesajları saklayabilirsiniz
  users: [],
  loading: false,
  usersLoading: false,
  error: null,
  lastUpdated: null,
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetMessaging: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchConversationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchConversationMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationMessages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchConversationMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(sendMessageThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUsersThunk.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(markMessagesAsReadThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(markMessagesAsReadThunk.fulfilled, (state, action) => {
        action.payload.forEach((msg) => {
          if (state.conversationMessages[msg.conversationId]) {
            state.conversationMessages[msg.conversationId] = state.conversationMessages[msg.conversationId].map(m =>
              m.id === msg.id ? { ...m, read: true } : m
            );
          }
        });
      })
      .addCase(markMessagesAsReadThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, resetMessaging } = messagingSlice.actions;
export default messagingSlice.reducer;
