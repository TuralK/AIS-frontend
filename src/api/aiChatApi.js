import axios from 'axios';

export const sendMessageApi = async (apiUrl, userMessage) => {
    try {
        const response = await axios.post(`${apiUrl}/chatWithAI`, { message: userMessage }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error communicating with AI:", error);
        throw error;
    }
};


export const getMessagesApi =
    async (apiUrl) => {
        const response = await axios.get(`${apiUrl}/`, {
            withCredentials: true
        }
        );
        return response.data.messages
    };


