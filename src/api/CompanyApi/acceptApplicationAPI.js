import axios from 'axios';

export const acceptApplication = async (applicationId, isApproved, file) => {
  const formData = new FormData();
  formData.append("upload-file", file);
  formData.append("isApproved", isApproved.toString());

  const response = await axios.put(`http://localhost:3005/applications/${applicationId}`, formData, {
      withCredentials: true,
      headers: {
          "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};