import axios from 'axios';

export const validateStudent = async () => {
    try {
        const response = await axios.get(`http://localhost:3004/`, {
          withCredentials: true
        })
        return response.data.dataValues;
    } catch (err) {
        if (err.response) {
            throw new Error(err.response.data || "An error occurred");
        }
        throw new Error("An error occurred");
    }
};
