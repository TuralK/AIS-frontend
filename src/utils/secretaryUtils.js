import { downloadFile, submitApplication } from '../api/SecretaryApi/secretaryApi';


export const handleDownload = (applicationId) => {
    return downloadFile(applicationId);
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
        // Dosya uzantısını kontrol et
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension === 'pdf') {
            setSelectedFile(file);
            setSelectedFileName(file.name);
        } else {
            throw new Error('Upload failed');
        }
    }
};




