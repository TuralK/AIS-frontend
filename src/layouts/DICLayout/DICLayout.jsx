import React from 'react'
import { UserLayout } from '../UserLayout/UserLayout';
import { useTranslation } from 'react-i18next';
import { validateDIC } from '../../api/DICApi/validateDICApi';

const DICLayout = () => {
    const { t, i18n } = useTranslation();
    return(
        <UserLayout
            validateFunction={validateDIC}
            menuItems = {[
            { item: t('company'), route: 'companyRequests' },
            { item: t('announcements'), route: 'announcementRequests' },
            { item: t('applications'), route: 'applicationRequests' },
            { item: t('internship'), route: 'internships' },
            { item: t('linkRequests'), route: 'linkRequests' },
            ]}
            userMenuItems = {[
            { item: t('settings'), route: 'settings' },
            { item: t('logout'), route: 'logout' }
            ]}
            basePath="admin"
            apiUrls={{ 
            logout: 'http://localhost:3001'
            }}
            // outletContext={{ userId, email, firstName, applications, setApplications }}
        />
    )
}
export default DICLayout