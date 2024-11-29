import axios from 'axios';

export const downloadFile = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:3006/applications/download/${id}/Application Form`, 
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

    // API'ye POST isteği
    const response = await axios.post(
      `http://localhost:3006/applications/${applicationId}`,
      formData,
      {
        withCredentials: true, 
      }
    );

    return response.data;
  } catch (error) {
    // Axios hatalarını ayrıştır
    if (error.response) {
      // Sunucudan dönen hata
      throw new Error(error.response.data.message || "An error occurred while submitting the application.");
    } else if (error.request) {
      // Sunucuya ulaşılamadıysa
      throw new Error("No response from the server. Please try again.");
    } else {
      // Diğer hatalar
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};

