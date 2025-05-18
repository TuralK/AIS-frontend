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
    resetAIChat: () => initialState,
    // Add message optimistically before API response
    addOptimisticMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    // Properly update optimistic message with real message 
    updateMessageById: (state, action) => {
      const { tempId, realMessage } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === tempId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...realMessage,
          isOptimistic: false,
        };
      }
    },
    // Remove an optimistic message by its id
    removeOptimisticMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    // ── getConversationThunk ──
    builder.addCase(getConversationThunk.pending, (state) => {
      state.historyLoading = true;
      state.historyError = null;
    });
    builder.addCase(getConversationThunk.fulfilled, (state, action) => {
      state.historyLoading = false;
      
      const optimisticMessages = state.messages.filter(msg => msg.isOptimistic);
      
      let serverMessages = [...action.payload];
      
      state.messages = [...serverMessages, ...optimisticMessages];
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
      
      // Optimistik kullanıcı mesajını kaldır
      state.messages = state.messages.filter(msg => 
        msg.id !== action.payload.tempMessageId
      );
      
      // Sunucudan gelen gerçek kullanıcı ve AI mesajlarını ekle
      state.messages.push(
        { 
          id: action.payload.userMessageId, 
          message: action.payload.userMessage, 
          isSentByUser: true,
          timestamp: new Date().toISOString(),
        },
        { 
          id: action.payload.aiMessageId, 
          message: action.payload.aiMessage, 
          isSentByUser: false,
          timestamp: new Date().toISOString(),
        }
      );
    });
    builder.addCase(sendMessageToAI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
      
      // Remove optimistic message
      if (action.payload.tempMessageId) {
        state.messages = state.messages.filter(msg => 
          msg.id !== action.payload.tempMessageId
        );
      }
      
      // Add error message
      state.messages.push({
        id: Date.now(),
        message: "Error: Could not get AI response",
        isSentByUser: false,
        timestamp: new Date().toISOString(),
      });
    });
  }
});

export const { 
  clearAIError, 
  resetAIChat, 
  addOptimisticMessage, 
  updateMessageById,
  removeOptimisticMessage
} = aiChatSlice.actions;

export default aiChatSlice.reducer;