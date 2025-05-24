import { downloadFile, submitApplication, submitManualApplication } from '../api/SecretaryApi/secretaryApi';


export const handleDownload = (applicationId, fileType) => {
    return downloadFile(applicationId, fileType);
};

export const handleSubmit = async (applicationId, selectedFile) => {
    if (selectedFile) {
        const response = await submitApplication(applicationId, selectedFile);
        if (response.status === 200) {
            window.location.reload(); 
        }
    } else {
        console.log('No file selected for application', applicationId);
        throw new Error('Submit failed');
    }
};

export const handleFileChange = (event, setSelectedFile, setSelectedFileName) => {
    const file = event.target.files?.[0];
    if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension === 'pdf') {
            setSelectedFile(file);
            setSelectedFileName(file.name);
        } else {
            throw new Error('Upload failed');
        }
    }
};

export const submitApplicationByType = async (application, selectedFile) => {
  const isManualApplication = application.isManual || 
                              application.type === 'manual' || 
                              !application.Announcement?.id ||
                              application.source === 'manual'; 

  if (isManualApplication) {
    return await submitManualApplication(application.id, selectedFile);
  } else {
    return await submitApplication(application.id, selectedFile);
  }
};