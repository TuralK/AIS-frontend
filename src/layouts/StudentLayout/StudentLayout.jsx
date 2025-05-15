import React from 'react'
import { UserLayout } from '../UserLayout/UserLayout';
import { validateStudent } from '../../api/StudentApi/validateStudentAPI.js';
import { useTranslation } from 'react-i18next';

const StudentLayout = () => {
    const { t, i18n } = useTranslation();
    return(
        <UserLayout
            validateFunction={validateStudent}
            menuItems = {[
            { item: t('home'), route: 'home' },
            { item: t('announcements'), route: 'announcements' },
            { item: t('applications'), route: 'applications' },
            { item: t('internship'), route: 'internship'}
            ]}
            userMenuItems = {[
            { item: t('profile'), route: 'profile' },
            { item: t('settings'), route: 'settings' },
            { item: t('logout'), route: 'logout' }
            ]}
            basePath="student"
            apiUrls={{ 
            messaging: 'http://localhost:3004',
            logout: 'http://localhost:3001'
            }}
            hasAITab={true}
            // outletContext={{ userId, email, firstName, applications, setApplications }}
        />
    )
}

export default StudentLayout