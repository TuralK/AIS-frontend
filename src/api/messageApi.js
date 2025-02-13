// src/api/conversationApi.js
import axios from "axios";

// Kullanıcıları getir (secretary, students, companies birleşik)
export const getUsers = async (apiUrl) => {
  try {
    const response = await axios.get(`${apiUrl}/users`, {
      withCredentials: true,
    });
    
    return response.data.allUsers;
  } catch (error) {
    console.error("Kullanıcılar getirilemedi:", error);
    throw error;
  }
};

// Konuşmaları getir
export const getConversations = async (apiUrl) => {
  try {
    const response = await axios.get(`${apiUrl}/conversations`, {
      withCredentials: true,
    });
    
    return response.data.conversations;
  } catch (error) {
    console.error("Konuşmalar getirilemedi:", error);
    throw error;
  }
};

// Yeni bir konuşma oluştur
export const createConversation = async (apiUrl, receiverEmail, receiverName) => {
  try {
    const response = await axios.post(
      `${apiUrl}/conversations`,
      { receiverEmail, receiverName },
      { withCredentials: true }
    );
    return response.data.conversations;
  } catch (error) {
    console.error("Konuşma oluşturulamadı:", error);
    throw error;
  }
};

// Belirli bir konuşmanın mesajlarını getir
export const getConversationMessages = async (apiUrl, conversationId) => {
  try {
    const response = await axios.get(`${apiUrl}/conversations/${conversationId}`, {
      withCredentials: true,
    });
    
    return response.data.messages;
  } catch (error) {
    console.error("Konuşma mesajları getirilemedi:", error);
    throw error;
  }
};

// Bir konuşmayı sil (veya soft-delete yap)
export const deleteConversation = async (apiUrl, conversationId) => {
  try {
    const response = await axios.delete(`${apiUrl}/conversations/${conversationId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Konuşma silinemedi:", error);
    throw error;
  }
};

// Bir mesaj gönderme api
export const sendMessageApi = async (apiUrl, conversationId, message, file = null) => {
  // FormData oluşturuluyor
  const formData = new FormData();
  formData.append('conversationId', conversationId);
  formData.append('message', message);
  if (file) {
    formData.append('file', file);
  }

  // API isteği gönderiliyor
  const response = await axios.post(`${apiUrl}/sendMessage`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};