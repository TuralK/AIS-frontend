import { studentAPI } from '../../../services/index'

export const updateStudentWebsite = async (webSite) => {
    try {
        const response = await studentAPI.put('/profile/webSite', {webSite}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}