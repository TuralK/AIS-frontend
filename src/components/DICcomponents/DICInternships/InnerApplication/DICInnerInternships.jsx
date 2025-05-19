import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatches } from 'react-router-dom';
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
import { updateApplicationDetail, downloadFile } from '../../../../api/DICApi/applicationDetails';
import { fetchInternshipDetails } from '../../../../api/DICApi/internshipDetailApi';

const DICInnerInternships = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]); 

  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadApplicationDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetchInternshipDetails(id);
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
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      if (extension !== 'pdf' && extension !== 'docx') {
        toast({
          title: t('invalidFile'),
          description: t('pleaseUploadPdfOrDocx'),
          variant: 'destructive',
        });
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
    if ((isApproved && !file) || (!isApproved && !feedback)) {
      toast({
        title: t('error'),
        description: isApproved ? t('pleaseUploadFile') : t('pleaseLeaveFeedback'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('isApproved', isApproved);
    formData.append('feedback', feedback);
    if (file) {
      formData.append('studentFile', file);
    }

    try {
      const response = await updateApplicationDetail(formData);
      toast({
        title: t('success'),
        description: response.data.message,
      });
      navigate('/admin/applicationRequests');
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToUpdateApplication'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setFeedbackModalOpen(false);
    }
  };

  const downloadButton = async () => {
    try {
      const response = await downloadFile(application.id);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-5 p-4">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader >
        <CardContent className="space-y-6">
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
      transition={{ duration: 50 }}
    >
      <Card className="w-full max-w-4xl mx-auto p-4 mt-5">
        <CardHeader>
          <CardTitle>{t('applicationDetailTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4 ">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('studentInfo')}</h3>
              <p><strong>{t('studentName')}:</strong> {application.Student.username}</p>
              <p><strong>{t('id')}:</strong> {application.Student.id}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('companyInfo')}</h3>
              <p><strong>{t('company')}:</strong> {application.Announcement.Company.name}</p>
              <p><strong>{t('description')}:</strong> {application.Announcement.description || 'N/A'}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('internshipPeriod')}</h3>
            <p><strong>{t('startDate')}:</strong> {new Date(application.Announcement.startDate).toLocaleDateString()}</p>
            <p><strong>{t('endDate')}:</strong> {new Date(application.Announcement.endDate).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              onClick={() => downloadButton()}
              className="flex-1 w-full hover:border-blue-500 hover:bg-blue-300 transition-colors duration-200"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              {t('downloadForm')}
            </Button>
            <div className="relative flex-1 ml-4 mr-5">
              <Button
                onClick={handleUploadClick}
                className="w-full hover:border-green-500 hover:bg-green-300 transition-colors duration-200"
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" />
                {fileName || t('uploadForm')}
              </Button>
              <Input
                type="file"
                id="studentFileInput"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <Button
            onClick={() => updateApplication(true)}
            disabled={isSubmitting}
            className="flex-1 bg-[#990000] hover:bg-[#500000] hover:text-white"
          >
            <Send className="mr-2 h-4 w-4" />
            {t('sendSecretary')}
          </Button>
          <Button
            onClick={() => setFeedbackModalOpen(true)}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1 bg-gray-300 hover:bg-gray-500 hover:text-white"
          >
            <X className="mr-2 h-4 w-4" />
            {t('reject')}
          </Button>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackModalOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={() => updateApplication(false)} disabled={isSubmitting}>
              {t('submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DICInnerInternships;