import axios from 'axios';

export const sendMessageApi = async (apiUrl, userMessage, conversationId) => {
    console.log("sendMessageApi called with userMessage:", userMessage, "and conversationId:", conversationId);
    const response = await axios.post(`${apiUrl}/chatWithAI`, { userMessage, conversationId }, {
        withCredentials: true,
    });
    console.log("sendMessageApi response", response.data);
    return response.data;
};

export const getConversation = async (apiUrl) => {
    const response = await axios.get(`${apiUrl}/conversation/ai`, {
        withCredentials: true
    });
    console.log("getConversation response", response.data);
    return response.data;
};


