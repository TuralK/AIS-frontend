import axios from 'axios';

export const fetchApplication = async (applicationId) => {
    try {
        const response = await axios.get(`http://localhost:3005/applications/${applicationId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};