import axios from 'axios';

export const sendMessageApi = async (apiUrl, userMessage, tempMessageId) => {
    
    const response = await axios.post(`${apiUrl}/chatWithAI`, { 
        userMessage, 
        tempMessageId 
    }, {
        withCredentials: true,
    });
    
    return response.data;
};

export const getConversation = async (apiUrl) => {
    const response = await axios.get(`${apiUrl}/conversation/ai`, {
        withCredentials: true
    });
    
    return response.data;
};