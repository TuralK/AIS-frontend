import { createSelector } from '@reduxjs/toolkit';

export const selectConversationMessages = createSelector(
  // İlk argüman: input selector, conversationId'ye göre ilgili mesajları alıyoruz.
  [(state, conversationId) => state.messaging.conversationMessages[conversationId]],
  // İkinci argüman: sonuç fonksiyonu; eğer mesajlar yoksa, aynı boş dizi referansını döndürün.
  (messages) => messages || []
);
