import axios from 'axios';

export const validateDIC = async () => {
    try {
        const response = await axios.get(`http://localhost:3003/`, {
            withCredentials: true
        })
        return response.data.dataValues;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data || "An error occurred");
        }
        throw new Error("An error occurred");
    }
};
