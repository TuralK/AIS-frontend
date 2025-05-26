import React from 'react'
import { UserLayout } from '../UserLayout/UserLayout';
import { validateCompany } from '../../api/CompanyApi/validateCompanyAPI';
import { useTranslation } from 'react-i18next';
import { companyAPI, loginAPI } from '../../services';

const CompanyLayout = () => {
    const { t, i18n } = useTranslation();
    return(
      <UserLayout
          validateFunction={validateCompany}
          menuItems = {[
            { item: t('applications'), route: 'applications' },
            { item: t('internships'), route: 'internships' },
            { item: t('publishAnnouncement'), route: 'publishAnnouncement' }
          ]}
          userMenuItems = {[
            { item: t('profile'), route: 'profile' },
            { item: t('settings'), route: 'settings' },
            { item: t('logout'), route: 'logout' }
          ]}
          basePath="company"
          baseUrl={companyAPI.defaults.baseURL}
          apiUrls={{ 
            logout: `${loginAPI.defaults.baseURL}`
          }}
          // outletContext={{ userId, email, firstName, applications, setApplications }}
      />
    )
}
export default CompanyLayout