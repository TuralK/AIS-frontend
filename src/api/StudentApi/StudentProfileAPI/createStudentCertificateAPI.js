import { studentAPI } from '../../../services/index'

export const createStudentCertificate = async (certificateData) => {
    try {
        const response = await studentAPI.post(`/profile/certificate`, certificateData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
