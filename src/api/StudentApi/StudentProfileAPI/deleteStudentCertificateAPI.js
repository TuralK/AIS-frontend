import { studentAPI } from '../../../services/index'

export const deleteStudentCertificate = async (certificateId) => {
    try {
        const response = await studentAPI.delete(`/profile/certificate/${certificateId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
