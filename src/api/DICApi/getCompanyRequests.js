import axios from 'axios';

export const fetchCompanyRequests = async () => {
    try {
        const response = await axios.get('http://localhost:3003/companyRequests', {
            withCredentials: true,
        });
        return response.data.companies;
    } catch (error) {
        throw new Error(error);
    }
};