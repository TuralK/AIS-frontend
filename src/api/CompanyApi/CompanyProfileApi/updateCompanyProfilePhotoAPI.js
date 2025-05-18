import { companyAPI } from '../../../services/index'

export const updateCompanyProfilePhoto = async (formData) => {
    try {
        const response = await companyAPI.put('/profile/logo', formData, { 
            withCredentials: true, 
            headers: { 'Content-Type': 'multipart/form-data' } 
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
  };
  