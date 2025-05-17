import { createAction } from "@reduxjs/toolkit";

export const connectConversation = createAction(
  "messaging/connectConversation", 
  (apiUrl, conversationId) => ({ payload: { apiUrl, conversationId } })
);

export const disconnectConversation = createAction("messaging/disconnectConversation");

export const sendMessageWS = createAction(
  "messaging/sendMessageWS",
  (conversationId, message, file, fileName) => ({
    payload: { conversationId, message, file, fileName }
  })
);

export const deleteMessageWS = createAction(
  "messaging/deleteMessageWS",
  (messageId) => ({ payload: { messageId } })
);

export const markReadWS = createAction(
  "messaging/markReadWS",
  (messageId) => ({ payload: { messageId } })
);