import React from 'react'
import { UserLayout } from '../UserLayout/UserLayout';
import { validateCompany } from '../../api/CompanyApi/validateCompanyAPI';
import { useTranslation } from 'react-i18next';

const CompanyLayout = () => {
    const { t, i18n } = useTranslation();
    return(
      <UserLayout
          validateFunction={validateCompany}
          menuItems = {[
            { item: t('home'), route: 'home' },
            { item: t('publishAnnouncement'), route: 'publishAnnouncement' },
            { item: t('applications'), route: 'applications' },
            { item: t('internships'), route: 'internships' }
          ]}
          userMenuItems = {[
            { item: t('profile'), route: 'profile' },
            { item: t('settings'), route: 'settings' },
            { item: t('logout'), route: 'logout' }
          ]}
          basePath="company"
          baseUrl='http://localhost:3005'
          apiUrls={{ 
            logout: 'http://localhost:3001'
          }}
          // outletContext={{ userId, email, firstName, applications, setApplications }}
      />
    )
}
export default CompanyLayout