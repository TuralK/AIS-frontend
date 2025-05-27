import { companyAPI } from '../../services/index'

export const uploadReportForm = async (token, formData) => {
  try {
      const response = await companyAPI.post(`/internship/upload`, formData, {
        params: {
            token: token,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
  } catch (error) {
      throw new Error(error);
  }
};