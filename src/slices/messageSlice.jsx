import { createSlice } from '@reduxjs/toolkit';
import { fetchConversationsThunk, fetchUsersThunk } from '../thunks/messageThunks';
import {
  connectConversation,
  disconnectConversation,
  sendMessageWS,
  deleteMessageWS,
  markReadWS
} from "../thunks/messagingActions";
const initialState = {
  conversations: [],
  users: [],
  loading: false,
  usersLoading: false,
  error: null,


  messages: {},
  wsLoading: false,
  messageStatus: {},
};

const messagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    resetMessaging: () => initialState,

    messagesLoaded: (state, action) => {
      const { conversationId, messages } = action.payload;

      state.messages[conversationId] = messages;
      state.wsLoading = false;
    },

    addMessage: (state, action) => {
      const { conversationId, msg } = action.payload;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      const existingIndex = state.messages[conversationId].findIndex(
        m => (m.tempId === msg.tempId) || (m.id === msg.id)
      );

      if (existingIndex >= 0) {
        state.messages[conversationId][existingIndex] = {
          ...state.messages[conversationId][existingIndex],
          ...msg
        };
      } else {
        state.messages[conversationId].push(msg);
      }
    },
    messageDelivered: (state, action) => {
      const { conversationId, messageId, id, timestamp } = action.payload;
      const messageIndex = state.messages[conversationId]?.findIndex(
        msg => msg.tempId === messageId 
      );
      if (messageIndex !== -1) {
        state.messages[conversationId][messageIndex].id = id;
        state.messages[conversationId][messageIndex].timestamp = timestamp;
        if (state.messageStatus[messageId]) {
          state.messageStatus[messageId].sending = false;
          state.messageStatus[messageId].actualId = id;
        }
      }
    },

    messageDeleted: (state, action) => {
      const { conversationId, messageId } = action.payload;

      // Remove message from the array (both by tempId and real id)
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          msg => msg.id !== messageId && msg.tempId !== messageId
        );

        // Clean up message status
        if (state.messageStatus[messageId]) {
          delete state.messageStatus[messageId];
        }
      }
    },

    messageSending: (state, action) => {
      const { tempId } = action.payload;
      state.messageStatus[tempId] = {
        sending: true,
        error: false,
        actualId: null
      };
    },
    messageSent: (state, action) => {
      const { tempId } = action.payload;
      if (state.messageStatus[tempId]) {
        state.messageStatus[tempId].sending = false;
      }
    },

    messageSendFailed: (state, action) => {
      const { tempId } = action.payload;
      if (state.messageStatus[tempId]) {
        state.messageStatus[tempId].sending = false;
        state.messageStatus[tempId].error = true;
      }
    },

    messageMarkedForDeletion: (state, action) => {
      const { conversationId, messageId } = action.payload;

      const messageIndex = state.messages[conversationId]?.findIndex(
        msg => msg.id === messageId || msg.tempId === messageId
      );

      if (messageIndex !== -1 && messageIndex !== undefined) {
        // Mark message as being deleted (for UI display)
        state.messages[conversationId][messageIndex].isDeleting = true;
      }
    },

    messageRead: (state, action) => {
      const { conversationId, messageId } = action.payload;

      const message = state.messages[conversationId]?.find(
        msg => msg.id === messageId
      );

      if (message) {
        message.is_read = true;
      }
    },

    setWsConnected: (state, action) => {
      state.wsConnected = action.payload;
    },

    clearMessages: state => {
      state.messages = {};
    },
  },
  extraReducers: builder => {
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

    builder
      .addCase(connectConversation, (s) => { s.wsLoading = true; })
      .addCase(disconnectConversation, (s) => { /* s.wsLoading = false; */ });
  }
});

export const {
  setWsConnected,
  clearError,
  messagesLoaded,
  resetMessaging,
  addMessage,
  messageDeleted,
  messageMarkedForDeletion,
  messageRead,
  messageDelivered,
  messageSending,
  messageSent,
  messageSendFailed
} = messagingSlice.actions;

export default messagingSlice.reducer;
