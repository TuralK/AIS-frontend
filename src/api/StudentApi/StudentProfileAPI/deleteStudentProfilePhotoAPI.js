import axios from 'axios';

export const deleteStudentProfilePhoto = async () => {
    try {
        const response = await axios.delete(`http://localhost:3004/profile/photo`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
