import { createSlice } from "@reduxjs/toolkit";
import { sendMessageToAI, getMessages, createConversationThunk, getConversationThunk } from '../thunks/aiChatThunk';

const initialState = {
  messages: [],
  loading: false,
  error: null,
  historyLoading: false,
  historyError: null,
  conversationCreated: false,
  conversations: [],
  conversationId: null
}

const messagingAISlice = createSlice({
  name: "aiMessages",
  initialState,
  reducers: {
    clearAIError: (state) => {
      state.error = null;
      state.historyError = null;
    },
    resetAIChat: () => initialState,
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationCreated = true;
        state.conversationId = action.payload.id;
      })
      .addCase(createConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "object" ? action.payload.error || "An error occurred" : action.payload;
      })

      .addCase(getConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(getConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(
          { message: action.payload.userMessage, fromUser: true },
          { message: action.payload.aiMessage, fromUser: false }
        );
      })
      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messages.push({
          message: "Error: Could not get AI response",
          fromUser: false
        });
      })

      .addCase(getMessages.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.messages = action.payload; 
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });
  }
});

export const { clearAIError, resetAIChat, setConversationId } = messagingAISlice.actions;
export default messagingAISlice.reducer;