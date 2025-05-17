import { createSelector } from '@reduxjs/toolkit';

// Basic selector to get conversation messages
const selectMessages = state => state.messaging.messages;

// Create a memoized selector for conversation messages
export const selectConversationMessages = createSelector(
  [selectMessages, (state, conversationId) => conversationId],
  (messages, conversationId) => {
    // Return the messages for the specific conversation or an empty array
    return messages[conversationId] || [];
  }
);

// Get all conversations
export const selectAllConversations = state => state.messaging.conversations;

// Get a specific conversation by ID
export const selectConversationById = (state, conversationId) => {
  return state.messaging.conversations.find(conv => conv.id === conversationId);
};

// Select message status by tempId
export const selectMessageStatus = (state, tempId) => {
  return state.messaging.messageStatus[tempId] || { sending: false, error: false };
};