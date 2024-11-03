import React from 'react';
import StudentHomePageCSS from './StudentHomePage.module.css';
import { useTranslation } from 'react-i18next';

const StudentHomePage = () => {
  const { t, i18n } = useTranslation();
  const rules = [
    t('summerRule1'), t('summerRule2'), t('summerRule3'), t('summerRule4'), t('summerRule5'), t('summerRule6'),
    t('summerRule7'), t('summerRule8'), t('summerRule9'), t('summerRule10'), t('summerRule11')
  ];

  return (
    <div className={StudentHomePageCSS.rules}>
      <h2 className={StudentHomePageCSS.heading}>{t('summerRegulations')}</h2>
      <table className={StudentHomePageCSS.table}>
        <thead className={StudentHomePageCSS.thead}>
          <tr className={StudentHomePageCSS.tr}>
            <th className={StudentHomePageCSS.th}></th>
            <th className={StudentHomePageCSS.th}>{t('description')}</th>
          </tr>
        </thead>
        <tbody className={StudentHomePageCSS.tbody}>
          {rules.map((rule, index) => (
            <tr key={index} className={StudentHomePageCSS.tr}>
              <td className={StudentHomePageCSS.th}>{index + 1}</td>
              <td className={StudentHomePageCSS.td}>{rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentHomePage;
