import { createSlice } from "@reduxjs/toolkit";
import { sendMessageToAI, getConversationThunk } from "../thunks/aiChatThunk";

const initialState = {
  messages: [],        // AI chat messages
  loading: false,      // loading state for sendMessage or getMessages
  error: null,         // sendMessage error state 
  historyLoading: false, // loading state for getConversation
  historyError: null    // getConversation error state
};

const aiChatSlice = createSlice({
  name: "aiMessages",
  initialState,
  reducers: {
    clearAIError: (state) => {
      state.error = null;
      state.historyError = null;
    },
    resetAIChat: () => initialState
  },
  extraReducers: (builder) => {
    // ── getConversationThunk ──
    builder.addCase(getConversationThunk.pending, (state) => {
      state.historyLoading = true;
      state.historyError = null;
    });
    builder.addCase(getConversationThunk.fulfilled, (state, action) => {
      state.historyLoading = false;
      state.messages = action.payload;
    });
    builder.addCase(getConversationThunk.rejected, (state, action) => {
      state.historyLoading = false;
      state.historyError = action.payload;
    });

    // ── sendMessageToAI ──
    builder.addCase(sendMessageToAI.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendMessageToAI.fulfilled, (state, action) => {
      state.loading = false;
      
      state.messages.push(
        { id: Date.now(), message: action.payload.userMessage, isSentByUser: true },
        { id: Date.now() + 1, message: action.payload.aiMessage, isSentByUser: false }
      );
    });
    builder.addCase(sendMessageToAI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.messages.push({
        id: Date.now(),
        message: "Error: Could not get AI response",
        isSentByUser: false
      });
    });
  }
});

export const { clearAIError, resetAIChat } = aiChatSlice.actions;
export default aiChatSlice.reducer;