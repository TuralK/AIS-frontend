import { companyAPI } from '../../services/index'

export const  uploadCompanyForm = async (internshipId, formData) => {
  try {
      const response = await companyAPI.post(`/internship/companyForm/${internshipId}`, formData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
  } catch (error) {
      throw new Error(error);
  }
};