import axios from 'axios';

const fetchApplicationDetails = async (applicationId) => {
    try {
        const response = await axios.get(`http://localhost:3003/applications/${applicationId}`, {
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
        const response =await axios.put(`http://localhost:3003/applications/${applicationId}`, formData, {
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
        const response = await axios.get(`http://localhost:3003/applications/download/${id}/Application Form`, {
            
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
