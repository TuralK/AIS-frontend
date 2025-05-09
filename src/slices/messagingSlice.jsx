import { createSlice } from "@reduxjs/toolkit";
import {
  connectConversation,
  disconnectConversation,
  sendMessageWS,
  deleteMessageWS,
  markReadWS
} from "../thunks/messagingActions";

const initialState = {
  conversations: [],
  conversationMessages: {},
  loading: false,
  error: null,
};

const messagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    messagesLoaded: (state, { payload }) => {
      state.conversationMessages[payload.conversationId] = payload.messages;
    },
    addMessage: (state, { payload }) => {
      state.conversationMessages[payload.conversationId].push(payload.msg);
    },
    messageDelivered: (state, { payload }) => {
      // optional: update temp→real status
    },
    messageDeleted: (state, { payload }) => {
      const arr = state.conversationMessages[payload.conversationId];
      state.conversationMessages[payload.conversationId] = arr.filter(m => m.id !== payload.messageId);
    },
    messageRead: (state, { payload }) => {
      const msgs = state.conversationMessages[payload.conversationId];
      const msg = msgs.find(m => m.id === payload.messageId);
      if (msg) msg.is_read = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // prevent REST thunks from interfering
      .addCase(connectConversation, state => { state.loading = true; })
      .addCase(disconnectConversation, state => { state.loading = false; });
  }
});

export const {
  messagesLoaded,
  addMessage,
  messageDelivered,
  messageDeleted,
  messageRead
} = messagingSlice.actions;
export default messagingSlice.reducer;
