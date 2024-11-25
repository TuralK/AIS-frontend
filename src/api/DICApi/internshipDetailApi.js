import axios from 'axios';

const fetchInternshipDetails = async (applicationId) => {
    try {
        const response = await axios.get(`http://localhost:3003/interns/${applicationId}`, {
            withCredentials: true,
        });
        return response.data; // This will be the JSON response from the server
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error; // Rethrow the error for further handling if needed
    }
};

const updateApplicationDetail = async (applicationId) => {
    try {
        const response =await axios.put(`/admin/applications/${application.id}`, formData, {
            withCredentials: true,
        });
        return response.data; // This will be the JSON response from the server
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error; // Rethrow the error for further handling if needed
    }
};

const downloadFile = async (id, fileType) => {
    try {
        const response = await axios.get(`/admin/applications/download/${id}/${fileType}`, {
            responseType: 'blob', // Important to specify responseType for downloading files
            withCredentials: true,
        });
        return response; // Return the entire response object
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error; // Rethrow the error for further handling if needed
    }
};



export {fetchInternshipDetails, updateApplicationDetail, downloadFile};
