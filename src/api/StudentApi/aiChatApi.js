import axios from 'axios';

export const sendMessageToAI = async (userMessage) => {
    try {
        const response = await axios.post(`http://localhost:3004/chatWithAI`,{ message: userMessage }, {
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

export default sendMessageToAI;