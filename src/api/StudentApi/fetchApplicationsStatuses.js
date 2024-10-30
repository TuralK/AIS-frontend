import axios from 'axios';

export const fetchApplicationsStatuses = async () => {
    try {
        const response = await axios.get('http://localhost:3004/applications', {
            withCredentials: true,
        });
        return response.data.applications;
    } catch (error) {
        throw new Error(error);
    }
}