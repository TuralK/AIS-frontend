import axios from 'axios';

export const validateToken = async (tokenFromURL) => {
    try {
        const response = await axios.get(`http://localhost/changePassword?token=${tokenFromURL}`);
        return response.data;
    } catch (err) {
        if (err.response) {
            throw new Error(err.response.data.error || "An error occurred");
        }
        throw new Error("An error occurred");
    }
};
