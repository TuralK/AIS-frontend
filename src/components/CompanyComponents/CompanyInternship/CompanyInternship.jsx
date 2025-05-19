import React, { useState, useEffect } from 'react'
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import styles from './CompanyInternship.module.css'
import { getInternship } from '../../../api/CompanyApi/getInternshipAPI';
import Loading from '../../LoadingComponent/Loading';

const CompanyInternship = () => {
  const { id } = useParams();

  const matches = useMatches();
  const { t, i18n } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInternship(id).finally(setLoading(false));
  }, []);

  if(loading) return <Loading />
  return (
    <div></div>
  )
}

export default CompanyInternship