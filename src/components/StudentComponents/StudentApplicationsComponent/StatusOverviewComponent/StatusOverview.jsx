import React from 'react'
import StatusOverviewCSS from './StatusOverview.module.css'
import { useTranslation } from 'react-i18next';

const StatusOverview = () => {
  const { t, i18n } = useTranslation();
  const statusDetails = [
    { icon: 'fa-building', label: t('company_evaluation') },
    { icon: 'fa-user-tie', label: t('coordinator_evaluation') },
    { icon: 'fa-file-pen', label: t('ssi_procedures') },
    { icon: 'fa-briefcase', label: t('internship_process') },
    { icon: 'fa-circle-xmark', label: t('rejected') },
  ];

  return (
    <div className={StatusOverviewCSS.statusOverview}>
        {statusDetails.map((status, index) => (
          <React.Fragment key={index}>
            <div className={StatusOverviewCSS.statusDetail}>
              <i className={`fa-solid ${status.icon} fa-2x`} />
              <p className={StatusOverviewCSS.detailText}>{status.label}</p>
            </div>
            {index < statusDetails.length - 2 && <div className={StatusOverviewCSS.horizontalLine} />}
            {index === statusDetails.length - 2 && (
              <div className={StatusOverviewCSS.verticalLineContainer}>
                <div className={StatusOverviewCSS.verticalLine} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
  )
}

export default StatusOverview