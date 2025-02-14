// messagingAISlice.js
import { createSlice } from "@reduxjs/toolkit";
import { sendMessageToAI, getMessages } from '../thunks/aiChatThunk';

const initialState = {
  messages: [],
  loading: false,
  error: null,
  historyLoading: false,
  historyError: null
}

const messagingAISlice = createSlice({
  name: "aiMessages",
  initialState,
  reducers: {
    clearAIError: (state) => {
      state.error = null
      state.historyError = null
    },
    resetAIChat: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false
        state.messages.push(
          { message: action.payload.userMessage, fromUser: true },
          { message: action.payload.aiMessage, fromUser: false }
        )
      })
      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.messages.push({
          message: "Error: Could not get AI response",
          fromUser: false
        })
      })
      
      .addCase(getMessages.pending, (state) => {
        state.historyLoading = true
        state.historyError = null
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.historyLoading = false
        state.messages = action.payload.map(msg => ({
          message: msg.content,
          fromUser: msg.role === "user"
        }))
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.historyLoading = false
        state.historyError = action.payload
      })
  }
})

export const { clearAIError, resetAIChat } = messagingAISlice.actions
export default messagingAISlice.reducer