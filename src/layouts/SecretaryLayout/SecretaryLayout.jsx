import React from 'react'
import { UserLayout } from '../UserLayout/UserLayout';
import { validateSecretary } from '../../api/SecretaryApi/validateSecretaryApi.js';
import { useTranslation } from 'react-i18next';

const SecretaryLayout = () => {
    const { t, i18n } = useTranslation();
    return(
        <UserLayout
            validateFunction={validateSecretary}
            menuItems = {[
            { item: t('home'), route: 'home' },
            ]}
            userMenuItems = {[
            { item: t('settings'), route: 'settings' },
            { item: t('logout'), route: 'logout' }
            ]}
            basePath="secretary"
            apiUrls={{ 
            logout: 'http://localhost:3001'
            }}
            // outletContext={{ userId, email, firstName, applications, setApplications }}
        />
    )
}

export default SecretaryLayout