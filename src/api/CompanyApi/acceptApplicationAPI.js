import { companyAPI } from '../../services/index'

export const acceptApplication = async (applicationId, isApproved, file) => {
  const formData = new FormData();
  formData.append("upload-file", file);
  formData.append("isApproved", isApproved.toString());

  const response = await companyAPI.put(`/application/applications/${applicationId}`, formData, {
      withCredentials: true,
      headers: {
          "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};