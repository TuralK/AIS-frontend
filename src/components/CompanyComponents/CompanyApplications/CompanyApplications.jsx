import React, {useState, useEffect} from "react"
import ListTable from "../../ListTableComponent/ListTable"
import CompanyApplicationsCSS from "./CompanyApplications.module.css"
import { fetchApplications } from "../../../api/CompanyApi/fetchApplicationsAPI"
import Loading from "../../LoadingComponent/Loading"

const CompanyApplications = () => {
  const headers = ["Student Name", "Applied At", "Grade", "Announcement"]
  const[applications, setApplications] = useState([]);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications()
      .then(applicationsData => {
        const formattedData = applicationsData.map(app => ({
          application_id: app.id,
          student_name: app.Student.username,
          applied_at: new Date(app.applyDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }), 
          grade: app.Student.year,
          announcement: `${app.Announcement.announcementName}`,
        }));
  
        setApplications(formattedData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Example with more than 8 items to demonstrate pagination
  //delete this
  const content = [
    {
      student_name: "Tural Karimli dddddd dddddddddddddd",
      applied_at: "May 12, 2023 Hello my name is Tural",
      grade: 3,
      announcement: "Applied to: Data Structures",
    },
    // ... first entry repeated 11 more times to demonstrate pagination
    ...Array(1001).fill({
      student_name: "Tural Karimli",
      applied_at: "May 12, 2023",
      grade: 3,
      announcement: "Applied to: Data Structures",
    }),
  ]

  const columnSizes = {
    "Student Name": "1fr",
    "Applied At": "1fr",
    "Grade": "0.5fr",
    "Announcement": "1fr",
  }

  if (loading) {
    return (
        <Loading />
    )
  }

  return (
    <div className={CompanyApplicationsCSS.card}>
      <div className="p-4">
        <ListTable headers={headers} content={applications} columnSizes={columnSizes} defaultItemsPerPage={11} isClickable={true} redirectField={"application_id"}/>
      </div>
    </div>
    
  )
}

export default CompanyApplications

