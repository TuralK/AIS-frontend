import axios from 'axios';

export const fetchAnnouncementData = async (opportunityId) => {
    try {
        const response = await axios.get(`http://localhost:3004/opportunities/:${opportunityId}`, {
            withCredentials: true,
        });
        console.log("ayn");
        console.log(response)
        return response.data.announcement;
    } catch (error) {
        throw new Error(error);
    }
};