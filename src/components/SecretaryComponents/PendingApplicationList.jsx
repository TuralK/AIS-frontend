import React, { useState, useMemo, useEffect } from 'react';
import { PendingApplicationCard } from './PendingApplicationCard.jsx';
import { useOutletContext } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Search, ArrowUp } from 'lucide-react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function PendingApplicationList() {
  const [searchTerm, setSearchTerm] = useState('');
  const { applications } = useOutletContext();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { t } = useTranslation();

  const filteredApplications = useMemo(() => {
    return applications.filter(app =>
      (app.Student.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.Announcement.Company.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.Announcement.announcementName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [applications, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.pageYOffset > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-110px)] ml-0 md:ml-[50px] relative">
      <div className="flex justify-end">
        <TextField
          id="input-with-icon-textfield"
          label={t('searchApplications')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            className: "bg-transparent text-black rounded-md mb-5 focus:outline-none text-base md:text-lg placeholder:text-base",
          }}
        />
      </div>
      {filteredApplications.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-700">
            {searchTerm ? t('noMatchingApplications') : t('secretaryNoApplication')}
          </h2>
        </div>
      ) : (
        filteredApplications.map((application) => (
          <PendingApplicationCard key={application.id} application={application} />
        ))
      )}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-[#790000] hover:bg-[#990000] text-white p-3 rounded-full transition-colors duration-300 focus:outline-none h-12 w-12 flex items-center justify-center"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}