import axios from 'axios';

export const validateSecretary = async () => {
    try {
        const response = await axios.get(`http://localhost:3006/`, {
            withCredentials: true
        });
        return [response.data.dataValues,response.data.applications];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data || "An error occurred");
        }
        throw new Error("An error occurred");
    }
};
