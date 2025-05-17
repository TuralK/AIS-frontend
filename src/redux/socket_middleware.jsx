import { createListenerMiddleware } from "@reduxjs/toolkit";
import { connectSocket, onSocket, emitSocket, disconnectSocket, getSocket } from "../utils/socket";
import {
  messagesLoaded,
  addMessage,
  messageDelivered,
  messageDeleted,
  messageMarkedForDeletion,
  messageSending,
  messageSent,
  messageSendFailed,
  messageRead
} from "../slices/messageSlice";
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
      dispatch(messageDelivered({
        conversationId,
        messageId: data.tempId, 
        id: data.id,
        timestamp: data.timestamp
      }));
    });

    onSocket("messageSuccesfullyDeleted", ({ deletedmessageId }) => {
      dispatch(messageDeleted({ conversationId, messageId: deletedmessageId }));
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

// SEND MESSAGE via WS with optimistic updates
socketListener.startListening({
  actionCreator: sendMessageWS,
  effect: (action, { dispatch }) => {
    const { conversationId, message, file, fileName } = action.payload;
    const socket = getSocket();

    // Create a temporary ID
    const tempId = `temp-${Date.now()}`;
    // Mark message as sending
    dispatch(messageSending({ tempId }));

    // Optimistically add message to UI
    dispatch(addMessage({
      conversationId,
      msg: {
        tempId,
        message,
        fileName,
        data: file ? btoa(String.fromCharCode.apply(null, new Uint8Array(file))) : null,
        timestamp: new Date().toISOString(),
        isSentByUser: true,
        is_read: false,
        delivered: false
      }
    }));

    // Set up event handler for successful delivery
    const messageDeliveredHandler = (data) => {
      if (data.tempId === tempId) {
        dispatch(messageSent({ tempId }));
        dispatch(messageDelivered({
          conversationId,
          messageId: data.tempId,
          id: data.id,
          timestamp: data.timestamp
        }));
        socket.off("messageDelivered", messageDeliveredHandler);
      }
    };

    // Set up event handler for failed delivery
    const messageSendErrorHandler = (data) => {
      if (data.tempId === tempId) {
        dispatch(messageSendFailed({ tempId }));

        // Remove this one-time listener
        socket.off("messageSendError", messageSendErrorHandler);
      }
    };

    // Register event handlers
    onSocket("messageDelivered", messageDeliveredHandler);
    onSocket("messageSendError", messageSendErrorHandler);

    // Send the message via socket
    emitSocket("sendMessage", {
      conversationId,
      message,
      file,
      fileName,
      tempId
    });
  }
});

// DELETE MESSAGE via WS with optimistic updates
socketListener.startListening({
  actionCreator: deleteMessageWS,
  effect: (action, { dispatch, getState }) => {
    const messageId = action.payload.messageId;

    // Get the current state
    const state = getState();

    // Find which conversation this message belongs to
    let targetConversationId = null;

    Object.entries(state.messaging.messages).forEach(([convId, messages]) => {
      if (messages.some(msg => msg.id === messageId || msg.tempId === messageId)) {
        targetConversationId = convId;
      }
    });

    if (targetConversationId) {
      // Optimistically mark message as being deleted (for UI)
      dispatch(messageMarkedForDeletion({
        conversationId: targetConversationId,
        messageId
      }));
    }

    // Send the delete command
    emitSocket("deleteMessage", { messageId });

  }
});

// MARK READ via WS
socketListener.startListening({
  actionCreator: markReadWS,
  effect: (action) => {
    emitSocket("markRead", { messageId: action.payload.messageId });
  }
});

export default socketListener.middleware;