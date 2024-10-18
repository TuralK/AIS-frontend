import axios from 'axios';

export const fetchAnnouncementRequests = async () => {
    try {
        const response = await axios.get('http://localhost:3003/announcementRequests', {
            withCredentials: true,
        });
        console.log(response.data.announcementsWithImages);
        return response.dataValues.announcementsWithImages;
    } catch (error) {
        throw new Error(error);
    }
};