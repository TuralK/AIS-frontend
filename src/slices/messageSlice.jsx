import { createSlice } from '@reduxjs/toolkit';
import { fetchConversationsThunk, fetchUsersThunk} from '../thunks/messageThunks';
import {
  connectConversation,
  disconnectConversation,
  sendMessageWS,
  deleteMessageWS,
  markReadWS
} from "../thunks/messagingActions";
const initialState = {
  // REST tarafı
  conversations: [],
  users: [],
  loading: false,
  usersLoading: false,
  error: null,

  // WS tarafı
  conversationMessages: {},   // { [convId]: Message[] }
  wsLoading: false,
};

const messagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    resetMessaging: () => initialState,
    // Socket.IO’dan gelenler:
    messagesLoaded: (state, { payload }) => {
      state.wsLoading = false;
      state.conversationMessages[payload.conversationId] = payload.messages;
    },
    addMessage: (state, { payload }) => {
      const arr = state.conversationMessages[payload.conversationId] ||= [];
      arr.push(payload.msg);
    },
    messageDeleted: (state, { payload }) => {
      const arr = state.conversationMessages[payload.conversationId] || [];
      state.conversationMessages[payload.conversationId] =
        arr.filter(m => m.id !== payload.messageId);
    },
    messageRead: (state, { payload }) => {
      const arr = state.conversationMessages[payload.conversationId] || [];
      const msg = arr.find(m => m.id === payload.messageId);
      if (msg) msg.is_read = true;
    },
  },
  extraReducers: builder => {
    // -------- REST THUNKS --------
    builder
      .addCase(fetchConversationsThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchConversationsThunk.fulfilled, (s, a) => {
        s.loading = false; s.conversations = a.payload;
      })
      .addCase(fetchConversationsThunk.rejected, (s, a) => {
        s.loading = false; s.error = a.payload || a.error.message;
      })

      .addCase(fetchUsersThunk.pending, (s) => { s.usersLoading = true; s.error = null; })
      .addCase(fetchUsersThunk.fulfilled, (s, a) => {
        s.usersLoading = false; s.users = a.payload;
      })
      .addCase(fetchUsersThunk.rejected, (s, a) => {
        s.usersLoading = false; s.error = a.payload || a.error.message;
      })

    // -------- WS ACTIONS --------
    builder
      .addCase(connectConversation, (s) => { s.wsLoading = true; })
      .addCase(disconnectConversation, (s) => { /* s.wsLoading = false; */ });
  }
});

export const {
  clearError,
  messagesLoaded,
  resetMessaging,
  addMessage,
  messageDeleted,
  messageRead
} = messagingSlice.actions;

export default messagingSlice.reducer;
