import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you'll use this for t()
import { Upload, FileText, X, CheckCircle, Download, Loader2 } from 'lucide-react'; // Icons for FileUploadSection
import { Tooltip } from "@mui/material"; // For FileUploadSection Tooltip
import IYTElogo from '../../../assets/iyte_logo_eng.png'; // Assuming this is your logo path
import { getUploadPage } from '../../../api/CompanyApi/getUploadPageAPI';
// import Loading from '../../LoadingComponent/Loading'; // Your Loading component
import FileUploadSection from '../../StudentComponents/StudentInternship/components/FileUploadSection';

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-700"></div>
  </div>
);


// Navbar Component
const CenteredNavbar = () => {
  const { t } = useTranslation(); // Assuming you'll use this for t()

  return (
    <nav className="bg-[#9a1220] text-white shadow-md">
      <div className="container mx-auto px-4 h-[100px] flex justify-center items-center">
        <div className="flex items-center">
          <img src={IYTElogo} alt="IZTECH Logo" className="h-[70px] w-auto" />
          <div className="ml-4 text-center"> {/* Ensure text-center for the container if titles should also be centered relative to each other */}
            <div className="text-2xl font-bold">{t('manualUpload.title') || 'Internship Management System'}</div>
            <div className="text-lg">{t('manualUpload.subtitle') || 'Manual Document Upload'}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Page Component
const ManualUploadPage = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [companyForm, setCompanyForm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);

  const { t } = useTranslation(); // Assuming you'll use this for t()

  const handleTemplateDownload = async (fileName) => {
    try {
      const result = await downloadTemplateFile(companyAPI.defaults.baseURL, fileName);

      if (result.success) {
        
      } else {
        alert(result.message || t("manualUpload.templateDownloadFailed"));
        console.error(result.message);
      }
    } catch (error) {
      alert(t("manualUpload.templateDownloadFailed"));
      console.error('Download error:', error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (token) {
      getUploadPage(token)
        .then((response) => {
          if (response.status === 200) {
            setIsAuthorized(true);
          } else {
            // setError(`Access Denied: Status ${response.status}. You are not eligible to see this page.`);
            setError(t('manualUpload.unauthorizedAccessMessage') || `Access Denied. You are not eligible to see this page.`);
          }
        })
        .catch((err) => {
          // setError('Failed to verify access. Please try again later.');
          setError(t('manualUpload.verificationFailedMessage') || 'Failed to verify access. Please try again later.');
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // setError('No access token provided. You are not eligible to see this page.');
      setError(t('manualUpload.noTokenMessage') || 'No access token provided. You are not eligible to see this page.');
      setIsLoading(false);
    }
  }, [t]); // Add t to dependency array if your error messages are translated

  const handleSubmit = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    if (!studentReport || !companyForm) {
      setSubmitMessage(t('manualUpload.bothFilesRequiredError') || 'Both student report and company form are required.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('');
    // Simulate API call
    console.log("Submitting:", { studentReport: studentReport.name, companyForm: companyForm.name });
    try {
      // Replace with your actual API call
      const formData = new FormData();
      formData.append('manualReport', studentReport);
      formData.append('manualForm', companyForm);
      const response = await uploadReportForm(token, formData);

      setCanSubmit(false);
      setSubmitMessage(t('manualUpload.submitSuccessMessage') || 'Files submitted successfully!');
      setStudentReport(null);
      setCompanyForm(null);
    //   alert(t('closeWindow') || "Files submitted successfully! You can close this window.");
    } catch (apiError) {
      console.error("Submission error:", apiError);
      setSubmitMessage(t('manualUpload.submitErrorMessage') || 'Failed to submit files. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <CenteredNavbar />
        <main className="flex-grow flex items-center justify-center p-6 bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
            <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('manualUpload.accessDeniedTitle') || "Access Denied"}</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
        <footer className="bg-gray-200 p-4 text-center text-sm text-gray-600">
             © {new Date().getFullYear()} {t('manualUpload.systemFooter') || "IZTECH Internship System"}
        </footer>
      </div>
    );
  }

  if (!isAuthorized) { // Should ideally be caught by the error state from the API response
     return (
      <div className="flex flex-col min-h-screen">
        <CenteredNavbar />
        <main className="flex-grow flex items-center justify-center p-6 bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
             <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('manualUpload.notAuthorizedTitle') || "Not Authorized"}</h2>
            <p className="text-gray-600">{t('manualUpload.notEligibleMessage') || "You are not eligible to see this page."}</p>
          </div>
        </main>
         <footer className="bg-gray-200 p-4 text-center text-sm text-gray-600">
             © {new Date().getFullYear()} {t('manualUpload.systemFooter') || "IZTECH Internship System"}
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CenteredNavbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#a51c30] mb-8">
            {t('manualUpload.manualUploadPageTitle') || "Manual Document Upload"}
          </h1>

          <FileUploadSection
            label={t('manualUpload.studentReportLabel') || "Student Internship Report"}
            uploadedFile={studentReport}
            onFileChange={setStudentReport}
            onRemove={() => setStudentReport(null)}
            disabled={!canSubmit}
            // showQuestionMark // Optionally enable
            // downloadTooltip={t('manualUpload.downloadStudentTemplateTooltip') || "Download student report template"}
            // showDownloadButton // Optionally enable if you have a template
            // onDownload={() => console.log("Download student template")}
          />

          <FileUploadSection
            label={t('manualUpload.companyFormLabel') || "Company Evaluation Form"}
            uploadedFile={companyForm}
            onFileChange={setCompanyForm}
            onRemove={() => setCompanyForm(null)}
            disabled={!canSubmit}
            // showQuestionMark
            downloadTooltip={t("manualUpload.downloadSPESTemplate")}
            showDownloadButton = {true} 
            onDownload={() => handleTemplateDownload('SummerPracticeCompanyFormTemplate.docx')}
          />
           {canSubmit && (
            <p className="text-sm text-gray-500 mt-2">{t('manualUpload.bothFilesRequiredError') || "Both files are required."}</p>
           )}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !studentReport || !companyForm || !canSubmit}
              className="w-full sm:w-auto bg-[#a51c30] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              {isSubmitting ? (
                <span>
                  <Loader2 className="animate-spin h-5 w-5 inline-block" /> Submitting...
                </span>
              ) : (t('manualUpload.submitButton') || 'Submit Documents')}
            </button>
            {submitMessage && (
              <p className={`mt-4 text-sm font-medium ${submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {submitMessage}
              </p>
            )}
          </div>
        </div>
      </main>
       <footer className="bg-gray-200 p-4 text-center text-sm text-gray-600 mt-auto">
         © {new Date().getFullYear()} {t('manualUpload.systemFooter') || "IZTECH Internship System"}
      </footer>
    </div>
  );
};

export default ManualUploadPage;

// To use this, you'd typically have i18next initialized, e.g., in your App.js or index.js:
