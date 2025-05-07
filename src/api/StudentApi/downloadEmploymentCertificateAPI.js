import axios from 'axios';

export const downloadEmploymentCertificate = async () => {
    try {
        const response = await axios.get('http://localhost:3004/download/CV', {
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