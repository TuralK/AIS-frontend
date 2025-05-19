import React from 'react'
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CompanyHome = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);
  
  return (
    <div>Company Home</div>
  )
}

export default CompanyHome