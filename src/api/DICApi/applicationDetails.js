import { adminAPI } from '../../services/index'

const fetchApplicationDetails = async (applicationId) => {
    try {
        const response = await adminAPI.get(`/applications/${applicationId}`, {
            withCredentials: true,
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error; 
    }
};

const updateApplicationDetail = async (applicationId, formData) => {
    try {
        const response =await adminAPI.put(`/applications/${applicationId}`, formData, {
            withCredentials: true,
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error; 
    }
};

const downloadFile = async (id) => {
    try {
        const response = await adminAPI.get(`/applications/download/${id}/ApplicationForm`, {
            
            withCredentials: true,
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error;
    }
};

export {fetchApplicationDetails, updateApplicationDetail, downloadFile};
