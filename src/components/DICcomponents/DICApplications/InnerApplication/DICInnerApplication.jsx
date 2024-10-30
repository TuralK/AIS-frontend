import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { fetchApplicationDetails, updateApplicationDetail, downloadFile } from '../../../../api/DICApi/applicationDetails'; 
import Loading from '../../../LoadingComponent/Loading';
import { useTranslation } from 'react-i18next';

const DICInnerApplication = () => {
    const { id } = useParams(); 
    const [application, setApplication] = useState(null); 
    const [feedback, setFeedback] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate(); 
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false); // State for feedback modal

    useEffect(() => {
        const loadApplicationDetails = async () => {
            try {
                const res = await fetchApplicationDetails(id);
                const data = res.application;
                console.log(data);
                setApplication(data);
            } catch (error) {
                console.error('Error fetching application details:', error);
                alert('Failed to fetch application details. Please try again later.');
            }
        };

        loadApplicationDetails();
    }, [id]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const extension = selectedFile.name.split('.').pop().toLowerCase();
            if (extension !== 'pdf' && extension !== 'docx') {
                alert('Please upload a PDF or DOCX file.');
                setFile(null);
                setFileName('');
            } else {
                setFile(selectedFile);
                setFileName(selectedFile.name);
            }
        }
    };

    const handleUploadClick = () => {
        document.getElementById('studentFileInput').click();
    };

    const updateApplication = async (isApproved) => {
        if ((isApproved && file) || !isApproved) {
            const formData = new FormData();
            formData.append('isApproved', isApproved);
            formData.append('feedback', feedback);
            if (file) {
                formData.append('studentFile', file);
            }

            try {
                const response = await updateApplicationDetail(formData); // Pass formData
                alert(response.data.message);
                navigate('/admin/applicationRequests');
            } catch (error) {
                console.error('Error processing the request:', error);
                alert('An error occurred. Please try again later.');
            }
        } else {
            alert('Please upload a file before submitting.');
        }
    };

    const downloadButton = async (fileType) => {
        try {
            const response = await downloadFile(application.id, fileType); // Pass necessary parameters
    
            const contentDispositionHeader = response.headers['content-disposition'];
            if (!contentDispositionHeader) {
                throw new Error('Content-Disposition header is missing in the response');
            }
            
            const filename = contentDispositionHeader.split('filename=')[1].replace(/"/g, '');
            const blob = new Blob([response.data]); // Here, response.data will be the blob data
            const url = window.URL.createObjectURL(blob);
    
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download the file. Please try again later.'); // Optional: show an alert
        }
    };
    

    const handleRejectClick = () => {
        setFeedbackModalOpen(true); // Open feedback modal when rejecting
    };

    const handleFeedbackSubmit = async () => {
        await updateApplication(false); // Call updateApplication with false (reject)
        setFeedbackModalOpen(false); // Close modal after submission
    };

    if (!application) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">{t('applicationDetailTitle')}</h2>
            <div className="student-info mb-4 border-b border-gray-300 pb-4">
                <p className="text-lg"><strong>{t('studentName')}:</strong> {application.Student.username}</p>
                <p className="text-lg"><strong>{t('id')}:</strong> {application.Student.id}</p>
                <p className="text-lg"><strong>{t('company')}:</strong> {application.Announcement.Company.name}</p>
                <p className="text-lg"><strong>{t('description')}:</strong> {application.Announcement.description || 'N/A'}</p>
                <p className="text-lg"><strong>{t('startDate')}:</strong> {new Date(application.Announcement.startDate).toLocaleDateString()}</p>
                <p className="text-lg"><strong>{t('endDate')}:</strong> {new Date(application.Announcement.endDate).toLocaleDateString()}</p>
            </div>
            
            {/* Butonları yan yana ve eşit boyutta getirmek için flex sınıfını kullanıyoruz */}
            <div className="flex flex-col space-y-4 mb-4">
                <div className="flex justify-between space-x-4">
                    <button className="flex-1 bg-[#990000] hover:bg-[#500000] transition text-white rounded-md" onClick={() => downloadButton('Updated Application Form')}>
                        <i className="fa-solid fa-file"></i> {t('downloadForm')} <i className="fa-solid fa-download"></i>
                    </button>
                    
                    <div className="relative flex-1">
                        <div className="border border-gray-300 p-2 cursor-pointer bg-gray-50 text-center rounded-md hover:bg-gray-200 transition" onClick={handleUploadClick}>
                            <i className="fa-solid fa-file"></i> {fileName || `${t('uploadForm')}`} <i className="fa-solid fa-upload"></i>
                        </div>
                        <input type="file" id="studentFileInput" className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
                    </div>
                </div>
                
                <div className="flex justify-between space-x-4">
                    <button className="flex-1 bg-[#990000] hover:bg-[#500000] transition text-white p-2 rounded-md">
                        {t('sendSecretary')}
                    </button>
                    <button className="flex-1 bg-gray-50 hover:bg-gray-200 text-black p-2 rounded-md">
                        {t('reject')}
                    </button>
                </div>
            </div>
    
            {/* Feedback Modal */}
            {isFeedbackModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md p-4 shadow-lg">
                        <h4 className="text-lg font-semibold">{t('provideFeedback')}</h4>
                        <textarea className="border border-gray-300 p-2 w-full mt-2" placeholder={t('optional')} rows="4" value={feedback} style={{ resize: "none" }} onChange={(e) => setFeedback(e.target.value)} />
                        <div className="flex justify-end mt-4">
                            <button className="bg-red-900 text-white p-2 rounded-md mr-2" onClick={handleFeedbackSubmit}>{t('submit')}</button>
                            <button className="bg-gray-300 text-black p-2 rounded-md" onClick={() => setFeedbackModalOpen(false)}>{t('cancel')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
     
};

export default DICInnerApplication;
