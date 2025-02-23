import axios from 'axios';

export const downloadApplicationForm = async (applicationId, fileType) => {
    try {
        const response = await axios.get(`http://localhost:3005/applications/download/${applicationId}/${fileType}`, {
            withCredentials: true,
            responseType: 'blob',
        });
        return {
            blobData: response.data,
            contentType: response.headers['content-type'],
        };
    } catch (error) {
        throw new Error(error);
    }
};