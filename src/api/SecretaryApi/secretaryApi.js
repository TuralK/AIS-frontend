import { secretaryAPI } from '../../services/index'

export const downloadFile = async (id, fileType) => {
  try {
    const response = await secretaryAPI.get(
      `/applications/download/${id}/${fileType}`, 
      {
        responseType: 'blob',  
        withCredentials: true, 
      }
    );

    const contentDisposition = response.headers['content-disposition'];
    const match = contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
    const fileName = match ? decodeURIComponent(match[1]) : 'downloaded_file';

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Download failed');
  }
};


export const submitApplication = async (applicationId, selectedFile) => {
  try {
    const formData = new FormData();
    formData.append("studentFile", selectedFile);

    const response = await secretaryAPI.post(
      `/applications/${applicationId}`,
      formData,
      {
        withCredentials: true, 
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred while submitting the application.");
    } else if (error.request) {
      throw new Error("No response from the server. Please try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};

export const submitManualApplication = async (applicationId, selectedFile) => {
  try {
    const formData = new FormData();
    formData.append("EmploymentCertificate", selectedFile); 

    const response = await secretaryAPI.post(
      `/manualApplications/${applicationId}`,
      formData,
      {
        withCredentials: true, 
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred while submitting the manual application.");
    } else if (error.request) {
      throw new Error("No response from the server. Please try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};
