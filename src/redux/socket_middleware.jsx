import { createListenerMiddleware } from "@reduxjs/toolkit";
import { connectSocket, onSocket, emitSocket, disconnectSocket } from "../utils/socket";
import {
  messagesLoaded,
  addMessage,
  messageDelivered,
  messageDeleted,
  messageRead
} from "../slices/messagingSlice";
import {
  connectConversation,
  disconnectConversation,
  sendMessageWS,
  deleteMessageWS,
  markReadWS
} from "../thunks/messagingActions";

const socketListener = createListenerMiddleware();

// CONNECT → load history & subscribe events
socketListener.startListening({
  actionCreator: connectConversation,
  effect: (action, { dispatch, getState }) => {
    const { apiUrl, conversationId } = action.payload;
    connectSocket({ apiUrl, conversationId });

    onSocket("conversationMessages", ({ messages }) => {
      dispatch(messagesLoaded({ conversationId, messages }));
    });
    
    onSocket("newMessage", (msg) => {
      dispatch(addMessage({ conversationId, msg }));
    });
    onSocket("messageDelivered", (data) => {
      dispatch(messageDelivered({ conversationId, ...data }));
    });
    onSocket("messageDeleted", ({ messageId }) => {
      dispatch(messageDeleted({ conversationId, messageId }));
    });
    onSocket("messageRead", ({ messageId }) => {
      dispatch(messageRead({ conversationId, messageId }));
    });
  }
});

// DISCONNECT
socketListener.startListening({
  actionCreator: disconnectConversation,
  effect: () => {
    disconnectSocket();
  }
});

// SEND / DELETE / READ via WS
socketListener.startListening({
  actionCreator: sendMessageWS,
  effect: (action, { dispatch }) => {
    const { conversationId, message, file, fileName } = action.payload;
    
    const tempId = Date.now().toString();
    
    dispatch(messageSending({ tempId }));
    
    dispatch(addMessage({
      conversationId,
      msg: {
        id: null,
        tempId: tempId,
        message,
        fileName,
        data: file ? btoa(String.fromCharCode.apply(null, new Uint8Array(file))) : null,
        timestamp: new Date().toISOString(),
        isSentByUser: true,
        is_read: false,
        delivered: false
      }
    }));
    
    
    onSocket("messageDelivered", (data) => {
      if (data.tempId === tempId) {
        dispatch(messageSent({ tempId }));
        dispatch(messageDelivered({ 
          conversationId, 
          messageId: tempId, 
          id: data.id, 
          timestamp: data.timestamp 
        }));
      }
    });
    
    onSocket("messageSendError", (data) => {
      if (data.tempId === tempId) {
        dispatch(messageSendFailed({ tempId }));
      }
    });
    
    
    emitSocket("sendMessage", {
      conversationId,
      message,
      file,
      fileName,
      tempId 
    });
  }
});
socketListener.startListening({
  actionCreator: deleteMessageWS,
  effect: (action) => {
    emitSocket("deleteMessage", action.payload.messageId);
  }
});
socketListener.startListening({
  actionCreator: markReadWS,
  effect: (action) => {
    emitSocket("markRead", action.payload.messageId);
  }
});

export default socketListener.middleware;
