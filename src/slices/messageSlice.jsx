import { createSlice } from '@reduxjs/toolkit';
import { fetchConversationsThunk, fetchConversationMessagesThunk, sendMessageThunk, fetchUsersThunk } from '../thunks/messageThunks';

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
  },
  extraReducers: (builder) => {
    builder
      // Konuşmaları çekme durumları
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
      // Konuşma mesajlarını çekme durumları
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
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Örneğin, gönderilen mesajı ilgili conversationMessages altına ekleyebilirsiniz.
        // state.conversationMessages[conversationId] = updatedMessages; 
        // Veya güncel veriyi yeniden çekmek için farklı bir thunk kullanabilirsiniz.
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.loading = false;
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
      });
  },
});

export default messagingSlice.reducer;
