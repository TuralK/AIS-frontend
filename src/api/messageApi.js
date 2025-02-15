import axios from "axios";

export const getUsers = async (apiUrl) => {
  try {
    const response = await axios.get(`${apiUrl}/users`, {
      withCredentials: true,
    });
    
    return response.data.allUsers;
  } catch (error) {
    console.error("Users could not fetch:", error);
    throw error;
  }
};

export const getConversations = async (apiUrl) => {
  try {
    const response = await axios.get(`${apiUrl}/conversations`, {
      withCredentials: true,
    });

    return response.data.conversations;
  } catch (error) {
    console.error("Conversations could not fetch:", error);
    throw error;
  }
};

export const createConversation = async (apiUrl, receiverEmail, receiverName) => {
  try {
    const response = await axios.post(
      `${apiUrl}/conversations`,
      { receiverEmail, receiverName },
      { withCredentials: true }
    );
    return response.data.conversations;
  } catch (error) {
    console.error("Conversation could not create:", error);
    throw error;
  }
};

export const getConversationMessages = async (apiUrl, conversationId) => {
  try {
    const response = await axios.get(`${apiUrl}/conversations/${conversationId}`, {
      withCredentials: true,
    });
    
    return response.data.messages;
  } catch (error) {
    console.error("Messages did not fetch:", error);
    throw error;
  }
};


export const deleteConversation = async (apiUrl, conversationId) => {
  try {
    const response = await axios.delete(`${apiUrl}/conversations/${conversationId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Conversation did not delete:", error);
    throw error;
  }
};


export const sendMessageApi = async (apiUrl, conversationId, message, file = null) => {
  
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


export const deleteMessage = async (apiUrl, messageId) => {
  try {
    const response = await axios.delete(`${apiUrl}/deleteMessage/${messageId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Message could not delete:", error);
    throw error;
  }
};