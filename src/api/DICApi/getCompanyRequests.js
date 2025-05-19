import { adminAPI } from '../../services/index'

export const fetchCompanyRequests = async () => {
    try {
        const response = await adminAPI.get('/companyRequests', {
            withCredentials: true,
        });
        console.log(response.data)
        return response.data.companies;
    } catch (error) {
        throw new Error(error);
    }
};