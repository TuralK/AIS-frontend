import { studentAPI } from '../../services/index'

export const downloadEmploymentCertificate = async () => {
    try {
        const response = await studentAPI.get('/download/CV', {
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