import React, { useEffect, useState } from 'react';
import fetchInternships from '../../../api/DICApi/internshipsApi.js';
import Loading from '../../LoadingComponent/Loading';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DICInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInternships = async () => {
      setLoading(true);
      try {
        const data = await fetchInternships();
        console.log(data); // Tam veri yapısını görmek için log ekledim
        if (data && Array.isArray(data.applications)) { 
          setInternships(data.applications); // Eğer uygulama varsa kullan
        } else {
          setInternships([]); // Uygulama yoksa boş dizi ata
        }
      } catch (error) {
        console.error('Error fetching internships:', error);
        setInternships([]); // Hata durumunda boş dizi ata
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gradient">{t('internshipTitle')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.length > 0 ? (
            internships.map(application => (
              <div key={application.id} className="bg-white rounded-lg shadow-xl border border-gray-300 transition-transform duration-300 hover:scale-105">
                <button
                  className="w-full text-left p-6 flex flex-col justify-between h-full"
                  onClick={() => navigate(`/admin/interns/${application.id}`)}
                >
                  <div>
                    <h5 className="text-xl font-bold text-gray-800 mb-2">{application.Student.username}</h5>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>{t('id')}:</strong> {application.Student.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>{t('company')}:</strong> {application.Announcement.Company.name}
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className="bg-red-500 text-white py-1 px-3 rounded-full text-xs font-semibold">
                      {t('moreDetails')}
                    </span>
                  </div>
                </button>
              </div>
            ))
          ) : (
            <h2 className="col-span-full text-xl font-semibold text-center text-gray-500">{t('noInternships')}</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default DICInternships;
