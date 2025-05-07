import axios from 'axios';

export const deleteStudentBannerImage = async () => {
    try {
        const response = await axios.delete(`http://localhost:3004/profile/bannerImage`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
