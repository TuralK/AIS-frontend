import React, { useState, useEffect } from 'react'
import { useMatches, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getInternships } from '../../../api/CompanyApi/getInternshipsAPI'
import ListTable from '../../ListTableComponent/ListTable';
import Loading from '../../LoadingComponent/Loading';
import styles from './CompanyInternships.module.css'

const CompanyInternships = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const headers = ["Student Name", "Applied At", "Grade", "Announcement"];
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const columnSizes = {
    "Student Name": "1fr",
    "Applied At": "1fr",
    "Grade": "0.5fr",
    "Announcement": "1fr",
  };
  
  useEffect(() => {
      getInternships()
        .then(data => {
          const formatted = data.map(app => ({
            internship_path: `/company/internships/${app.id}`,
            // Replace student_name with a clickable component
            student_name: (
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/company/student-profile/${app.studentId}`);
                }}
              >
                {app.Student.username}
              </span>
            ),
            applied_at: new Date(app.Application.applyDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            grade: app.Student.year,
            announcement: app.Application.Announcement.announcementName,
          }));
          setInternships(formatted);
        })
        .catch(() => setInternships([]))
        .finally(() => setLoading(false));
    }, [navigate]);

  if (loading) return <Loading />;

  return (
    <div className={styles.card}>
      <div className="p-4">
        {internships.length === 0 ? (
          <div className={styles.noResults}>
            No internships applications found
          </div>
        ) : (
          <ListTable
            headers={headers}
            content={internships}
            columnSizes={columnSizes}
            defaultItemsPerPage={11}
            isClickable={true}
            redirectField={"internship_path"}
          />
        )}
      </div>
    </div>
  )
}

export default CompanyInternships