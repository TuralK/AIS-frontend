import axios from 'axios';

export const deleteStudentCertificate = async (certificateId) => {
    try {
        const response = await axios.delete(`http://localhost:3004/profile/certificate/${certificateId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
