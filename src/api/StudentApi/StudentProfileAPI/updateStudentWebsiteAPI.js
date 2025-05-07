import axios from 'axios';

export const updateStudentWebsite = async (webSite) => {
    try {
        const response = await axios.put('http://localhost:3004/profile/webSite', {webSite}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}