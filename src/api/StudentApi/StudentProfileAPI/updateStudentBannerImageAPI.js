import { studentAPI } from '../../../services/index'

export const updateStudentBannerImage = async (formData) => {
  try {
      const response = await studentAPI.put('/profile/bannerImage', formData,{ 
          withCredentials: true, 
          headers: { 'Content-Type': 'multipart/form-data' } 
      });
      return response.data;
  } catch (error) {
      throw new Error(error);
  }
};