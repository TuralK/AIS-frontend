import { studentAPI } from '../../../services/index'

export const deleteStudentProfilePhoto = async () => {
    try {
        const response = await studentAPI.delete(`/profile/photo`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
