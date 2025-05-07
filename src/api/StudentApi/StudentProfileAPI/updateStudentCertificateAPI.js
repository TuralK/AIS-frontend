import axios from 'axios';

export const updateStudentCertificate = async (certificateId, certificateData) => {
    try {
        const response = await axios.put(`http://localhost:3004/profile/certificate/${certificateId}`, certificateData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}