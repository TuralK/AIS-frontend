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

const fetchManualApplicationDetails = async (applicationId) => {
    try {
        const response = await adminAPI.get(`/manualApplications/${applicationId}`, {
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

const updateManualApplicationDetail = async (applicationId, formData) => {
    try {
        const response =await adminAPI.put(`/manualApplications/${applicationId}`, formData, {
            withCredentials: true,
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error; 
    }
};

const downloadFile = async (id, fileType) => {
    try {
        const response = await adminAPI.get(`/applications/download/${id}/${fileType}`, {
            
            withCredentials: true,
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error;
    }
};

export {updateManualApplicationDetail, fetchManualApplicationDetails, fetchApplicationDetails, updateApplicationDetail, downloadFile};
