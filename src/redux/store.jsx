import { configureStore } from '@reduxjs/toolkit';
import messagingReducer from '../slices/messageSlice';
import messagingAISlice from '../slices/aiChatSlice';

export const store = configureStore({
  reducer: {
    messaging: messagingReducer,
    aiMessaging: messagingAISlice
  },
});
