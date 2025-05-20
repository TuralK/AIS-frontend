import { companyAPI } from '../../services/index'

export const rejectApplication = async (applicationId, isApproved) => {
  try {
      const response = await companyAPI.put(`/application/applications/${applicationId}`, isApproved, {
        withCredentials: true,
      });
      return response.data;
  } catch (error) {
      throw new Error(error);
  }
};