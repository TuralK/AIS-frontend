import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './utils/translatePage.js';

import Login from "./pages/auth_pages/Login/Login";
import ChangePassword from "./pages/auth_pages/ChangePassword/ChangePassword";
import SignUp from "./pages/auth_pages/SignUp/SignUp";
import { StudentLayout } from "./layouts/StudentLayout/StudentLayout.jsx";
import StudentHome from "./components/StudentComponents/StudentHomePageComponent/StudentHomePage.jsx";
import DICHome from "./components/DICcomponents/DICHome.jsx";
import StudentAnnouncements from "./components/StudentComponents/StudentAnnouncementsComponent/StudentAnnouncements.jsx";
import StudentAnnouncement from "./components/StudentComponents/StudentAnnouncementComponent/StudentAnnouncement.jsx";
import Loading from "./components/LoadingComponent/Loading.jsx";
import { DICLayout } from "./layouts/DICLayout/DICLayout.jsx";
import CompanyCards from "./components/DICcomponents/DICCompanyRequests/companyRequestComponent.jsx";
import DICAnnouncementRequest from "./components/DICcomponents/DICAnnouncementRequests/DICAnnouncementRequest.jsx";
import DICAnouncementDetails from "./components/DICcomponents/DICAnnouncemenDetails/DICAnouncementDetails.jsx";

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
      ]
    }
  ]);

  return (
    <RouterProvider router={routes} />
  );
};

export default App;
