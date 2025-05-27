import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/text_area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../ui/dialog';
import { toast } from '../../../ui/use-toast';
import { Skeleton } from '../../../ui/skeleton';
import { Download, Upload, Send, X } from 'lucide-react';
import { fetchApplicationDetails, fetchManualApplicationDetails, updateApplicationDetail, updateManualApplicationDetail, downloadFile } from '../../../../api/DICApi/applicationDetails';
import office from '../../../../assets/office.jpg'
import CustomAlertDialog from '../../../ui/custom_alert';

function bufferToBase64(bufferData) {
  let binary = '';
  const bytes = bufferData instanceof Uint8Array ? bufferData : new Uint8Array(bufferData);
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

const DICInnerApplication = () => {
  const { id } = useParams();
  const location = useLocation();
  const [application, setApplication] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isTypeAlertOpen, setIsTypeAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Check if this is a manual application based on the URL
  const isManualApplication = location.pathname.includes('/manualApplication/');

  useEffect(() => {
    const loadApplicationDetails = async () => {
      try {
        setIsLoading(true);
        let res;
        
        if (isManualApplication) {
          res = await fetchManualApplicationDetails(id);
        } else {
          res = await fetchApplicationDetails(id);
        }
        
        setApplication(res.application);
      } catch (error) {
        toast({
          title: t('error'),
          description: t('failedToFetchDetails'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadApplicationDetails();
  }, [id, t, isManualApplication]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUploadClick = () => {
    document.getElementById('studentFileInput').click();
  };

  const updateApplication = async (isApproved) => {
    if ((isApproved && !file) || (!isApproved && !feedback)) {
      const alertMessage = isApproved ? t('pleaseUploadFile') : t('pleaseLeaveFeedback');
      setAlertMessage(alertMessage);
      setIsTypeAlertOpen(true);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    if (file) {
      formData.append('ApplicationForm', file);
    }

    formData.append('isApproved', isApproved);
    if (!isApproved && feedback) {
      formData.append('feedback', feedback);
    }

    try {
      // Use different endpoint based on application type
      if (isManualApplication) {
        await updateManualApplicationDetail(id, formData);
      } else {
        await updateApplicationDetail(id, formData);
      }
      
      const alertMessage = isApproved ? t('applicationApprovedByAdmin') : t('applicationDisapprovedByAdmin');
      setAlertMessage(alertMessage);
      setIsAlertOpen(true);
    } catch (error) {
      setAlertMessage(t('failedToUpdateApplication'));
      setIsTypeAlertOpen(true);
    } finally {
      setIsSubmitting(false);
      setFeedbackModalOpen(false);
    }
  };

  const downloadButton = async (fileType) => {
    try {
      const response = await downloadFile(application.id, fileType);
      const blob = new Blob([response.data], { type: response.headers["content-type"] || "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const disposition = response.headers["content-disposition"];
      const fileName = disposition ? disposition.split("filename=")[1].replace(/"/g, "") : fileType;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setErrorMessage(t('error_message'));
      setDownloadError(true);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full mb-4" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!application) {
    return null;
  }

  // Handle different data structures for manual vs regular applications
  let imageSrc = office;
  let announcementName = '';
  let companyName = '';
  let startDate = '';
  let endDate = '';
  let description = '';

  if (isManualApplication) {
    // Manual application structure
    announcementName = t('manualApplication');
    companyName = application.companyName;
    startDate = '-';
    endDate = '-';
    description = application.companyEmail ? `${t('companyEmail')}: ${application.companyEmail}` : '';
  } else {
    // Regular application structure
    const imgData = application.Announcement.image?.data;
    if (imgData) {
      const base64String = bufferToBase64(imgData);
      imageSrc = `data:image/jpeg;base64,${base64String}`;
    }
    announcementName = application.Announcement.announcementName;
    companyName = application.Announcement.Company.name;
    startDate = application.Announcement.startDate;
    endDate = application.Announcement.endDate;
    description = application.Announcement.description;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <CustomAlertDialog
          isOpen={downloadError}
          onClose={() => setDownloadError(false)}
          title={t('error')}
          description={errorMessage}
          onConfirm={() => setDownloadError(false)}
          confirmLabel={t('ok')}
        />
        <Card className="w-full max-w-6xl mx-auto p-4 mt-5">
          <CardHeader>
            <CardTitle className='mx-auto'>{announcementName}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/5 flex-shrink-0 aspect-video">
              <img
                src={imageSrc}
                alt={announcementName}
                className="w-full h-full object-cover rounded-lg max-h-64"
              />

              {!isManualApplication && (
                <div className="mt-4 space-y-2 lg:hidden">
                  <h3 className="text-lg font-semibold">{t('internshipPeriod')}</h3>
                  <p><strong>{t('startDate')}:</strong> {new Date(startDate).toLocaleDateString()}</p>
                  <p><strong>{t('endDate')}:</strong> {new Date(endDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div className="w-full lg:w-3/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('studentInfo')}</h3>
                  <p className="break-words">
                    <strong>{t('studentName')}:</strong>{" "}
                    <span className="break-all">{application.Student.username}</span>
                  </p>
                  <p>
                    <strong>{t('id')}:</strong> {application.Student.id}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('companyInfo')}</h3>
                    <p className="break-words">
                      <strong>{t('company')}:</strong>{" "}
                      <span className="break-all">{companyName}</span>
                    </p>
                  </div>

                  {!isManualApplication && (
                    <div className="hidden lg:block">
                      <h3 className="text-lg font-semibold mb-2">{t('internshipPeriod')}</h3>
                      <p><strong>{t('startDate')}:</strong> {new Date(startDate).toLocaleDateString()}</p>
                      <p><strong>{t('endDate')}:</strong> {new Date(endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 w-full">
                  <div className="break-words w-full space-y-2">
                    <strong className="block text-lg font-semibold">
                      {isManualApplication ? t('additionalInfo') : t('description')}:
                    </strong>
                    <div className="whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto">
                      {description || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                onClick={() => isManualApplication ? downloadButton('ManualApplicationForm') : downloadButton('ApplicationForm')}
                className="w-full bg-blue-100 hover:border-blue-500 hover:bg-blue-300"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('downloadForm')}
              </Button>
              <div className="relative w-full">
                <Button
                  onClick={handleUploadClick}
                  className="w-full bg-green-100 hover:border-green-500 hover:bg-green-300"
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {fileName || t('uploadForm')}
                </Button>
                <Input
                  type="file"
                  id="studentFileInput"
                  className="hidden"
                  accept=".pdf"
                  onChange={(event) => {
                    const selectedFile = event.target.files[0];
                    if (selectedFile) {
                      const isPdf = selectedFile.type === "application/pdf";
                      if (!isPdf) {
                        setAlertMessage(t("pleaseUploadPdf"));
                        setIsAlertOpen(true);
                        event.target.value = "";
                      } else {
                        handleFileChange(event);
                      }
                    }
                  }}
                />
                <CustomAlertDialog
                  isOpen={isAlertOpen}
                  onClose={() => setIsAlertOpen(false)}
                  title={t("error")}
                  description={alertMessage}
                  onConfirm={() => setIsAlertOpen(false)}
                  confirmLabel={t("ok")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                onClick={() => updateApplication(true)}
                disabled={isSubmitting}
                className="w-full text-white bg-[#990000] hover:bg-[#700000]"
              >
                <Send className="mr-2 h-4 w-4" />
                {t('sendSecretary')}
              </Button>
              <Button
                onClick={() => setFeedbackModalOpen(true)}
                variant="outline"
                disabled={isSubmitting}
                className="w-full bg-gray-300 hover:bg-gray-500 hover:text-white"
              >
                <X className="mr-2 h-4 w-4" />
                {t('reject')}
              </Button>
              <CustomAlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={t("success")}
                description={alertMessage}
                onConfirm={() => {
                  setIsAlertOpen(false);
                  navigate('/admin/applicationRequests');
                }}
                confirmLabel={t("ok")}
              />
              <CustomAlertDialog
                isOpen={isTypeAlertOpen}
                onClose={() => setIsTypeAlertOpen(false)}
                title={t("error")}
                description={alertMessage}
                onConfirm={() => setIsTypeAlertOpen(false)}
                confirmLabel={t("ok")}
              />
            </div>
          </CardFooter>
        </Card>

        <Dialog open={isFeedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('provideFeedback')}</DialogTitle>
            </DialogHeader>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setFeedbackModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-500 hover:text-white"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={() => updateApplication(false)}
                disabled={isSubmitting}
                className="bg-[#990000] hover:bg-[#500000] text-white"
              >
                {t('submit')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default DICInnerApplication;