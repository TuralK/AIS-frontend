import axios from 'axios';

export const createStudentCertificate = async (certificateData) => {
    try {
        const response = await axios.post(`http://localhost:3004/profile/certificate`, certificateData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
