import { studentAPI } from '../../../services/index'

export const deleteStudentBannerImage = async () => {
    try {
        const response = await studentAPI.delete(`/profile/bannerImage`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
