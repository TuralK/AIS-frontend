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
    console.log("Connecting to socket", apiUrl, conversationId);
    connectSocket({ apiUrl, conversationId });

    onSocket("conversationMessages", ({ messages }) => {
        console.log(conversationId, messages.length)
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
  effect: (action) => {
    emitSocket("sendMessage", action.payload);
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
