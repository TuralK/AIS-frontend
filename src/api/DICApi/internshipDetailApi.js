import { adminAPI } from '../../services/index'

const fetchInternshipDetails = async (applicationId) => {
    try {
        const response = await adminAPI.get(`/internship/internships/${applicationId}`, {
            withCredentials: true,
        });
        console.log('Response from fetchInternshipDetails:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching application details:', error);
        throw error;
    }
};

const updateApplicationDetail = async (applicationId) => {
    try {
        const response = await axios.put(`/admin/applications/${application.id}`, formData, {
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

const fetchDocument = async (id, applicationType, fileType) => {
    try {
        const response = await adminAPI.get(`/internship/download/${id}/${applicationType}/${fileType}`, {
            responseType: 'blob',
            headers: {
                'Accept': '*/*',
            },
            withCredentials: true,
        });

        return response;
    } catch (error) {
        console.error(`Error fetching document ${id}:`, error);
        throw error;
    }
};


const downloadDocument = async (id, applicationType, fileType, fallbackFileName) => {
    try {
        const response = await fetchDocument(id, applicationType, fileType);
        const blob = response.data;

        const contentDisposition = response.headers['content-disposition'];
        let fileName = fallbackFileName;

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match && match[1]) {
                fileName = match[1];
            }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error(`Error downloading document ${id}:`, error);
        throw error;
    }
};


const evaluateInternship = async (id, payload) => {
  // payload örn: { status, feedbackToStudent, feedbackToCompany, feedbackContextStudent, feedbackContextCompany }
  return adminAPI.put(`/internship/internships/${id}`, payload, {withCredentials: true});
};


export { evaluateInternship, fetchInternshipDetails, updateApplicationDetail, downloadFile, fetchDocument, downloadDocument };
