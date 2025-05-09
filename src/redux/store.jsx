import { configureStore } from '@reduxjs/toolkit';
import messagingReducer from '../slices/messageSlice';
import messagingAISlice from '../slices/aiChatSlice';
import settingsSlice  from '../slices/settingsSlice';
import socketMiddleware  from './socket_middleware';

export const store = configureStore({
  reducer: {
    messaging: messagingReducer,
    aiMessaging: messagingAISlice,
    settings: settingsSlice,
  },
  middleware: (getDefault) =>
    getDefault().prepend(socketMiddleware)
});
