import { companyAPI } from '../../services/index'

export const evaluateInternship = async (internshipId, evaluateData) => {
  try {
      const response = await companyAPI.put(`/internship/internships/${internshipId}`, evaluateData, {
        withCredentials: true,
      });
      return response.data;
  } catch (error) {
      throw new Error(error);
  }
};