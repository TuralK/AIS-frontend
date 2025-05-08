import axios from 'axios';

export const uploadSpes = async (selectedFile) => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('fileType', 'Manual Summer Practice Evaluation Survey');

  const response = await axios.post('http://localhost:3004/file', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
};
