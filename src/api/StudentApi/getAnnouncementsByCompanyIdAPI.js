import { studentAPI } from '../../services/index'

export const getAnnouncementByCompanyId = async (companyId) => {
    try {
        const response = await studentAPI.get(`/application/opportunities/company/${companyId}`, {
            withCredentials: true,
        });
        return response.data.opportunity;
    } catch (error) {
        throw new Error(error);
    }
};