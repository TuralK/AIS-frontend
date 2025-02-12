import { configureStore } from '@reduxjs/toolkit';
import messagingReducer from '../slices/messageSlice';

export const store = configureStore({
  reducer: {
    messaging: messagingReducer,
    
  },
});
