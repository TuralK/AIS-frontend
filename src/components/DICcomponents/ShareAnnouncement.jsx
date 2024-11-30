import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUp, Edit, X } from 'lucide-react';

const ShareAnnouncement = () => {
  const { t } = useTranslation();
  const [announcement, setAnnouncement] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement announcement submission logic
    console.log('Announcement submitted:', announcement);
    setAnnouncement('');
  };

  const toggleAnnouncement = () => {
    setIsOpen(prev => !prev);
  };

  if (isMobile && !isOpen) {
    return (
      <button
        onClick={toggleAnnouncement}
        className="fixed bottom-4 left-4 z-50 bg-white text-gray-700 rounded-full p-3 shadow-lg border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        <Edit size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-4 z-50 border border-black rounded-lg">
      {!isOpen && (
        <button
          onClick={toggleAnnouncement}
          className="bg-white text-gray-700 rounded-t-lg px-4 py-2 flex items-center justify-between gap-2 border border-gray-300 hover:bg-gray-100 transition-colors w-64"
        >
          <div className="flex items-center gap-2">
            <Edit size={20} />
            <span className="font-semibold">{t('announceTitleHome')}</span>
          </div>
          <ChevronUp size={20} />
        </button>
      )}

      {isOpen && (
        <div className="bg-gray-100 border border-gray-300 rounded-t-lg shadow-lg w-80 sm:w-96 flex flex-col" style={{ height: !isMobile ? 'calc(100vh - 110px)' : '500px' }}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{t('announceTitleHome')}</h2>
            <button onClick={toggleAnnouncement} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-full p-4">
            <div className="flex-grow">
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder={t('placeholderHome')}
                className="w-full h-full min-h-[200px] p-3 border border-gray-300 rounded resize-none"
                required
              />
            </div>
            <button type="submit" className="bg-[#990000] text-white py-2 px-4 rounded w-full text-lg hover:bg-[#500000] mt-4">
              {t('submit')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShareAnnouncement;