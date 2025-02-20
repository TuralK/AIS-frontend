import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { fetchApplicationDetails, updateApplicationDetail, downloadFile } from '../../../../api/DICApi/applicationDetails';
import office from '../../../../assets/office.jpg'
import CustomAlertDialog from '../../../ui/custom_alert';

const DICInnerApplication = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadError, setDownloadError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isTypeAlertOpen, setIsTypeAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const loadApplicationDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetchApplicationDetails(id);
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
  }, [id]);

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
      // This is the file that signed and uploaded by coordinator
      formData.append('studentFile', file);
    }
    try {
      const response = await updateApplicationDetail(id, formData);
      const alertMessage = isApproved ? t('applicationApprovedByAdmin') : t('applicationDisapprovedByAdmin');
      setAlertMessage(alertMessage);
      setIsAlertOpen(true);
    } catch (error) {
      console.error('Update error:', error);
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
      console.error("File download error:", error);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        {/* Component will be shown when the downloaded file is not sent by server to indicate */}
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
            <CardTitle className='mx-auto'>{application.Announcement.announcementName}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/5 flex-shrink-0 aspect-video">
              <img
                src={application.Announcement.image || office}
                alt={application.Announcement.announcementName}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="w-full lg:w-3/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('studentInfo')}</h3>
                  <p className="break-words"><strong>{t('studentName')}:</strong> <span className="break-all">{application.Student.username}</span></p>
                  <p><strong>{t('id')}:</strong> {application.Student.id}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{t('companyInfo')}</h3>
                  <p className="break-words"><strong>{t('company')}:</strong> <span className="break-all">{application.Announcement.Company.name}</span></p>
                  <p className="break-words"><strong>{t('description')}:</strong> <span className="break-all">{application.Announcement.description || 'N/A'}</span></p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">{t('internshipPeriod')}</h3>
                <p><strong>{t('startDate')}:</strong> {new Date(application.Announcement.startDate).toLocaleDateString()}</p>
                <p><strong>{t('endDate')}:</strong> {new Date(application.Announcement.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                onClick={() => downloadButton('Updated Application Form')}
                className="w-full bg-blue-100 hover:border-blue-500 hover:bg-blue-300 transition-colors duration-200"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('downloadForm')}
              </Button>
              <div className="relative w-full">
                <Button
                  onClick={handleUploadClick}
                  className="w-full bg-green-100 hover:border-green-500 hover:bg-green-300 transition-colors duration-200"
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
                {/* Component will be shown when the uploaded file is not in correct format to warn */}
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
                className="w-full text-white bg-[#990000] hover:bg-[#700000] hover:text-white"
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
              {/* Component will be shown when the application approved/disapproved to indicate */}
              <CustomAlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={t("error")}
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
                onConfirm={() => {
                  setIsTypeAlertOpen(false); // Alert'ı kapat
                }}
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
                className="bg-gray-200 hover:bg-gray-500 hover:text-white text-gray-700 border-gray-200"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={() => updateApplication(false)}
                disabled={isSubmitting}
                className="bg-[#990000] hover:bg-[#500000] text-white border-none transition-colors"
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