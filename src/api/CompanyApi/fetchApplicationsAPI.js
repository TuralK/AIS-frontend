import axios from 'axios';

export const fetchApplications = async () => {
    try {
        const response = await axios.get('http://localhost:3005/applications', {
            withCredentials: true,
        });
        //console.log(response.data)
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};