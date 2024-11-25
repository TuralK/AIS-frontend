import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './utils/translatePage.js';

import Login from "./pages/auth_pages/Login/Login";
import ChangePassword from "./pages/auth_pages/ChangePassword/ChangePassword";
import SignUp from "./pages/auth_pages/SignUp/SignUp";
import { StudentLayout } from "./layouts/StudentLayout/StudentLayout.jsx";
import StudentHome from "./components/StudentComponents/StudentHomePageComponent/StudentHomePage.jsx";
import DICHome from "./components/DICcomponents/DICHome/DICHome.jsx";
import StudentAnnouncements from "./components/StudentComponents/StudentAnnouncementsComponent/StudentAnnouncements.jsx";
import StudentAnnouncement from "./components/StudentComponents/StudentAnnouncementComponent/StudentAnnouncement.jsx";
import StudentApplications from "./components/StudentComponents/StudentApplicationsComponent/StudentApplications.jsx";
import { DICLayout } from "./layouts/DICLayout/DICLayout.jsx";
import CompanyCards from "./components/DICcomponents/DICCompanyRequests/companyRequestComponent.jsx";
import DICAnnouncementRequest from "./components/DICcomponents/DICAnnouncementRequests/DICAnnouncementRequest.jsx";
import DICAnouncementDetails from "./components/DICcomponents/DICAnnouncemenDetails/DICAnouncementDetails.jsx";
import DICApplications from "./components/DICcomponents/DICApplications/DICApplications.jsx";
import DICInnerApplication from "./components/DICcomponents/DICApplications/InnerApplication/DICInnerApplication.jsx";
import DICInternships from "./components/DICcomponents/DICInternships/DICInternships.jsx";
import DICInnerInternships from "./components/DICcomponents/DICInternships/InnerApplication/DICInnerInternships.jsx";

const App = () => {
  const { t, i18n } = useTranslation();
  
  const routes = createBrowserRouter([
    { 
      path: '/',
      element: <Login />
    },
    {
      path: '/changePassword',
      element: <ChangePassword />
    },
    {
      path: `/${t('signUpLink')}`, 
      element: <SignUp />
    },
    {
      path: '/student',
      element: <StudentLayout />,
      children: [
        { index: true, element: <StudentHome /> },
        { path: "home", element: <StudentHome /> },
        { path: "announcements", element: <StudentAnnouncements /> },
        { path: 'announcements/:announcementId', element: <StudentAnnouncement /> },
        { path: "applications", element: <StudentApplications />}
      ]
      // children: [
      //   {path: "applications", element: }
      //   {path: "notifications", element: },
      //   {path: "profile", element: }
      //   {path: "settings", element: }
      // ]
    },
    {
      path: '/admin',
      element: <DICLayout />,
      children: [
        { index: true, element: <DICHome /> },
        { path: "home", element: <DICHome /> },
        { path: "companyRequests", element: <CompanyCards /> },
        { path: 'announcementRequests', element: <DICAnnouncementRequest /> },
        { path: 'announcement/:id', element: <DICAnouncementDetails /> },
        { path: 'applicationRequests', element: <DICApplications /> },
        { path: 'application/:id', element: <DICInnerApplication />},
        { path: 'internships', element: <DICInternships />},
        { path: 'internship/:id', element: <DICInnerInternships />}
      ]
    }
  ]);

  return (
    <RouterProvider router={routes} />
  );
};

export default App;
