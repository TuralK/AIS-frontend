import axios from 'axios';

export const sendMessageApi = async (apiUrl, userMessage, conversationId) => {
    const response = await axios.post(`${apiUrl}/chatWithAI`, { userMessage, conversationId }, {
        withCredentials: true,
    });
    return response.data;
};


export const getMessagesApi =
    async (apiUrl,conversationId) => {
        const response = await axios.get(`${apiUrl}/conversations/${conversationId}`, {
            withCredentials: true
        }
    );
    return response.data.messages
};


export const createConversation = async (apiUrl) => {
    const response = await axios.post(`${apiUrl}/conversation/ai`, {}, {
        withCredentials: true
    });
    return response.data.conversations;
};

export const getConversation = async (apiUrl) => {
    const response = await axios.get(`${apiUrl}/conversation/ai`, {
        withCredentials: true
    });
    return response.data;
};


