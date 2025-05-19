import React, { useState, useEffect } from "react";
import { useMatches, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ListTable from "../../ListTableComponent/ListTable";
import CompanyApplicationsCSS from "./CompanyApplications.module.css";
import { fetchApplications } from "../../../api/CompanyApi/fetchApplicationsAPI";
import Loading from "../../LoadingComponent/Loading";

const CompanyApplications = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  // Update document title
  useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const headers = ["Student Name", "Applied At", "Grade", "Announcement"];
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications()
      .then(data => {
        const formatted = data.applications.map(app => ({
          application_path: `/company/applications/${app.id}`,
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
          applied_at: new Date(app.applyDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          grade: app.Student.year,
          announcement: app.Announcement.announcementName,
        }));
        setApplications(formatted);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <Loading />;

  const columnSizes = {
    "Student Name": "1fr",
    "Applied At": "1fr",
    "Grade": "0.5fr",
    "Announcement": "1fr",
  };

  return (
    <div className={CompanyApplicationsCSS.card}>
      <div className="p-4">
        {applications.length === 0 ? (
          <div className={CompanyApplicationsCSS.noResults}>
            No applications found
          </div>
        ) : (
          <ListTable
            headers={headers}
            content={applications}
            columnSizes={columnSizes}
            defaultItemsPerPage={11}
            isClickable={true}
            redirectField={"application_path"}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyApplications;
