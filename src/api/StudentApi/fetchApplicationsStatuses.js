import { studentAPI } from '../../services/index'

export const fetchApplicationsStatuses = async () => {
    try {
        const response = await studentAPI.get('/application/applications', {
            withCredentials: true,
        });
        return response.data.applications;
    } catch (error) {
        throw new Error(error);
    }
}