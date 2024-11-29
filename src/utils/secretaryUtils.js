import { downloadFile, submitApplication } from '../api/SecretaryApi/secretaryApi';


export const handleDownload = (applicationId) => {
    return downloadFile(applicationId);
};

export const handleSubmit = (applicationId, selectedFile) => {
    if (selectedFile) {
        submitApplication(applicationId, selectedFile);
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




