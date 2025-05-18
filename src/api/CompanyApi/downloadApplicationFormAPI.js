import { companyAPI } from '../../services/index'

export const downloadApplicationForm = async (applicationId, fileType) => {
    try {
        const response = await companyAPI.get(`/applications/download/${applicationId}/${fileType}`, {
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