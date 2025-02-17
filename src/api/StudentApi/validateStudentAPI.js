import axios from 'axios';

export const validateStudent = async () => {
    try {
        const response = await axios.get(`http://localhost:3004/`, {
            withCredentials: true
        })
        localStorage.removeItem("conversationId");
        return response.data.dataValues;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data || "An error occurred");
        }
        throw new Error("An error occurred");
    }
};
