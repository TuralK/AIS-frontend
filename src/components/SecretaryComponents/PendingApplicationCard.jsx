import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { handleFileChange, handleSubmit, handleDownload } from '../../utils/secretaryUtils';
import LogoPlaceholder from '../../assets/logo_placeholder.png';
import CustomAlertDialog from '../ui/custom_alert';

export function PendingApplicationCard({ application }) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [alert, setAlert] = useState(false);
  const [uploadAlert, setUploadAlert] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);


  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <form
        onSubmit={(e) => {
          handleSubmit(e, selectedFile);
        }}
        className="p-6 grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6"
      >
        <div className="lg:col-span-2 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            <img
              src={LogoPlaceholder}
              alt={application.Announcement.Company.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold">{application.Announcement.Company.name}</h2>
        </div>

        <div className="flex-1">
          <p className="font-bold text-gray-700">
            {t('student')} <span className="font-normal">{application.Student.username}</span>
          </p>
          <p className="font-bold text-gray-700 mt-2">
            {t('companyTitle')} <span className="font-normal">{application.Announcement.Company.name}</span>
          </p>
          <p className="font-bold text-gray-700 mt-2">
            {t('announcement')} <span className="font-normal">{application.Announcement.announcementName}</span>
          </p>
          <p className="font-bold text-gray-700 mt-2">
            {t('startDate')}{' '}
            <span className="font-normal">
              {new Intl.DateTimeFormat('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(new Date(application.Announcement.startDate))}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3 min-w-[130px]">
          <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-3">
            <label
              type="button"
              onClick={async () => {
                try {
                  await handleDownload(application.id);
                } catch (error) {
                  console.error('Download failed:', error);
                  setAlert(true);
                }
              }}
              className="flex items-center justify-center px-4 py-2 text-sm border-2 border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-white transition-colors"
            >
              <span className="whitespace-nowrap">{t('downloadForm')}</span>
            </label>
            <CustomAlertDialog
              isOpen={alert}
              onClose={() => setAlert(false)}
              title={t('error')}
              description={t('didNotDownload')}
              onConfirm={() => setAlert(false)}
              confirmLabel={t('ok')}
            />

            {!selectedFile ? (
              <div>
                <label
                  htmlFor={`file-upload-${application.id}`}
                  className="flex items-center justify-center px-4 py-2 text-sm border-2 border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="whitespace-nowrap">{t('uploadCertificate')}</span>
                </label>
                <input
                  id={`file-upload-${application.id}`}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={async (e) => {
                    try {
                      await handleFileChange(e, setSelectedFile, setSelectedFileName);
                      setFileSelected(true);
                    } catch (error) {
                      setUploadAlert(true);
                    }
                  }}
                />
                <CustomAlertDialog
                  isOpen={uploadAlert}
                  onClose={() => setUploadAlert(false)}
                  title={t('error')}
                  description={t('didNotUpload')}
                  onConfirm={() => setUploadAlert(false)}
                  confirmLabel={t('ok')}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-2 text-sm bg-green-100 text-green-800 rounded">
                <span className="whitespace-nowrap">{selectedFileName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setSelectedFileName('');
                    setFileSelected(false);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {fileSelected && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleSubmit(application.id, selectedFile)}
                className="mt-auto px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                {t('submit')}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

