import { studentAPI } from '../../../services/index'

export const updateStudentCertificate = async (certificateId, certificateData) => {
    try {
        const response = await studentAPI.put(`/profile/certificate/${certificateId}`, certificateData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}