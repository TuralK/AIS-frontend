import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUp, Edit, X } from 'lucide-react';

const ShareAnnouncement = () => {
  const { t } = useTranslation();
  const [announcement, setAnnouncement] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement announcement submission logic
    console.log('Announcement submitted:', announcement);
    setAnnouncement('');
  };

  const toggleAnnouncement = () => {
    setIsOpen(prev => !prev);
  };

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
        <div className="bg-gray-100 border border-gray-300 rounded-t-lg shadow-lg w-80 sm:w-96 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex-grow">{t('announceTitleHome')}</h2>
            <button onClick={toggleAnnouncement} className="text-gray-500 hover:text-gray-700 ml-40">
              <X size={30} />
            </button>
          </div>


          <form onSubmit={handleSubmit} className="p-4">
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder={t('placeholderHome')}
              className="w-full min-h-[100px] max-h-[100px] p-3 border border-gray-300 rounded resize-y mb-3"
              required
            />
            <button type="submit" className="bg-[#990000] text-white py-2 px-4 rounded w-full text-lg hover:bg-[#500000]">
              {t('submit')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShareAnnouncement;
