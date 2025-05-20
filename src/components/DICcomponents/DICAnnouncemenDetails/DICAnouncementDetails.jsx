import React, { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom'; 
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loading from '../../LoadingComponent/Loading';
import { fetchAnnouncementById, updateAnnouncementById } from '../../../api/DICApi/announcementDetailApi.js';
import office from '../../../assets/office.jpg';

const baseUrl = 'http://localhost:3005';

const DICAnouncementDetails = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  
  const [announcement, setAnnouncement] = useState(null); 
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const navigate = useNavigate(); 
  const { id } = useParams(); 
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAnnouncementById(id); 
        setAnnouncement(data);
        setImageSrc(data.image ? `${baseUrl}/${data.image}` : office)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateAnnouncement = async (isApproved) => {
    if (isApproved) {
      await handleApproval();
    } else {
      setShowPopup(true); // Show the popup for rejection feedback
    }
  };

  const handleApproval = async () => {
    try {
      await updateAnnouncementById(id, true, feedback); 
      navigate(-1); 
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleReject = async () => {
    try {
      await updateAnnouncementById(id, false, feedback);
      navigate(-1);
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  if (loading) return <Loading />; 
  if (error) return <p className="text-red-500">{t('errorFetchingData')}: {error}</p>; 
  if (!announcement) return <p>{t('noAnnouncementFound')}</p>; 

  return (
    <div className="flex flex-col md:flex-row max-w-4xl mx-auto my-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <div className="announcementImage mb-6 md:mr-6 rounded-l-lg overflow-hidden shadow-md flex-shrink-0 md:w-1/2 h-64">
        <img 
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105" 
          src={imageSrc} 
          alt={announcement.announcementName} 
        />
      </div>

      <div className="content flex-grow mb-4 md:ml-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{announcement.Company.name}</h1>
          <h3 className="text-xl font-bold text-gray-700 mt-2">{announcement.announcementName}</h3>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{announcement.description}</p>
          <div className="flex justify-between text-gray-600 mt-2">
            <p>
              {t('startDate')}: <span className="font-semibold">{announcement.formattedStartDate}</span>
            </p>
            <p>
              {t('endDate')}: <span className="font-semibold">{announcement.formattedEndDate}</span>
            </p>
          </div>
        </div>
        <div className="announcementActions flex mt-4 space-x-4">
          <button 
            className="bg-[#990000] text-white rounded-md py-2 px-4 hover:bg-[#600000] transition duration-200"
            onClick={() => updateAnnouncement(true)}
          >
            {t('approve')}
          </button>
          <button 
            className="bg-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-400 transition duration-200"
            onClick={() => updateAnnouncement(false)}
          >
            {t('reject')}
          </button>
        </div>
      </div>

      {/* Popup for feedback when rejecting */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">{t('provideFeedback')}</h2>
            <textarea
              className="w-full h-44 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200 mb-4"
              value={feedback}
              style={{resize:"none"}}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t('placeholderAnnounceDetail')}
            />
            <div className="flex justify-end">
              <button 
                className="bg-[#990000] text-white rounded-md py-2 px-4 hover:bg-[#600000] transition duration-200 mr-2"
                onClick={handleReject}
              >
                {t('submit')}
              </button>
              <button 
                className="bg-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-400 transition duration-200"
                onClick={() => setShowPopup(false)}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DICAnouncementDetails;
