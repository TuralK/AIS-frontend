import axios from 'axios';

export const rejectApplication = async (applicationId, isApproved) => {
  try {
      const response = await axios.put(`http://localhost:3005/applications/${applicationId}`, isApproved, {
        withCredentials: true,
      });
      return response.data;
  } catch (error) {
      throw new Error(error);
  }
};