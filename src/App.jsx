import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './utils/translatePage.js';

import Login from "./pages/auth_pages/Login/Login";
import ChangePassword from "./pages/auth_pages/ChangePassword/ChangePassword";
import SignUp from "./pages/auth_pages/SignUp/SignUp";
import StudentLayout from "./layouts/StudentLayout/StudentLayout.jsx";
import StudentHome from "./components/StudentComponents/StudentHomePageComponent/StudentHomePage.jsx";
import StudentAnnouncements from "./components/StudentComponents/StudentAnnouncementsComponent/StudentAnnouncements.jsx";
import StudentAnnouncement from "./components/StudentComponents/StudentAnnouncementComponent/StudentAnnouncement.jsx";
import StudentApplications from "./components/StudentComponents/StudentApplicationsComponent/StudentApplications.jsx";
import DICLayout from "./layouts/DICLayout/DICLayout.jsx";
import CompanyCards from "./components/DICcomponents/DICCompanyRequests/companyRequestComponent.jsx";
import DICAnnouncementRequest from "./components/DICcomponents/DICAnnouncementRequests/DICAnnouncementRequest.jsx";
import DICAnouncementDetails from "./components/DICcomponents/DICAnnouncemenDetails/DICAnouncementDetails.jsx";
import DICApplications from "./components/DICcomponents/DICApplications/DICApplications.jsx";
import DICInnerApplication from "./components/DICcomponents/DICApplications/InnerApplication/DICInnerApplication.jsx";
import DICInternships from "./components/DICcomponents/DICInternships/DICInternships.jsx";
import DICInnerInternships from "./components/DICcomponents/DICInternships/InnerInternship/DICInnerInternships.jsx";
import SecretaryLayout from "./layouts/SecretaryLayout/SecretaryLayout.jsx";
import PendingApplicationList from "./components/SecretaryComponents/PendingApplicationList.jsx";
import CompanyLayout from "./layouts/CompanyLayout/CompanyLayout.jsx";
import CompanyHome from "./components/CompanyComponents/CompanyHome/CompanyHome.jsx";
import CompanyApplications from './components/CompanyComponents/CompanyApplications/CompanyApplications.jsx';
import PublishAnnouncement from "./components/CompanyComponents/PublishAnnouncement/PublishAnnouncement.jsx";
import CompanyApplication from "./components/CompanyComponents/CompanyApplication/CompanyApplication.jsx";
import Settings from "./components/Settings/Settings.jsx";
import StudentInternship from "./components/StudentComponents/StudentInternship/StudentInternship.jsx";
import StudentProfile from "./components/StudentComponents/StudentProfileComponent/StudentProfile.jsx";
import NotFound from "./components/UtilComponents/NotFound.jsx";
import AnnouncementRequest from "./components/DICcomponents/DICAnnouncementRequests/DICAnnouncementRequest.jsx";
import CompanyProfile from "./components/CompanyComponents/CompanyProfileComponent/CompanyProfile.jsx";
import CompanyInternships from "./components/CompanyComponents/CompanyInternships/CompanyInternships.jsx";
import CompanyInternship from "./components/CompanyComponents/CompanyInternship/CompanyInternship.jsx";
import StudentSettings from "./components/StudentComponents/StudentSettings/StudentSettings.jsx";

const initialVh = window.innerHeight;
document.documentElement.style.setProperty('--initial-vh', `${initialVh}px`);


const App = () => {
  const { t, i18n } = useTranslation();
  
  const routes = createBrowserRouter([
    { 
      path: '/',
      element: <Login />,
      handle: { titleKey: 'login' }
    },
    {
      path: '/changePassword',
      element: <ChangePassword />,
      handle: { titleKey: 'changePassword' }
    },
    {
      path: '/signup', 
      element: <SignUp />,
      handle: { titleKey: 'signUp' }
    },
    {
      path: '/student',
      element: <StudentLayout />,
      children: [
        { index: true, element: <StudentHome />, handle: { titleKey: 'home' } },
        { path: "home", element: <StudentHome />, handle: { titleKey: 'home' } },
        { path: "announcements", element: <StudentAnnouncements />, handle: { titleKey: 'announcements' } },
        { path: 'announcements/:announcementId', element: <StudentAnnouncement />, handle: { titleKey: 'announcementDetails' } },
        { path: "applications", element: <StudentApplications />, handle: { titleKey: 'applications' } },
        { path: "internship", element: <StudentInternship />, handle: { titleKey: 'internship' } },
        { path: "settings", element: <StudentSettings />, handle: { titleKey: 'settings' } },
        { path: "profile", element: <StudentProfile />, handle: { titleKey: 'profile' }},
        { path: "company-profile/:id", element: <CompanyProfile />, handle: {titleKey: 'profile'} }
      ]
    },
    {
      path: '/company',
      element: <CompanyLayout />,
      children: [
        { index: true, element: <CompanyHome />, handle: { titleKey: 'home' } },
        { path: "home", element: <CompanyHome />, handle: { titleKey: 'home' } },
        { path: "applications", element: <CompanyApplications />, handle: { titleKey: 'applications' } },
        { path: "publishAnnouncement", element: <PublishAnnouncement />, handle: { titleKey: 'publishAnnouncement' } },
        { path: "applications/:id", element: <CompanyApplication />, handle: { titleKey: 'application' } },
        { path: "settings", element: <Settings apiUrl={'http://localhost:3005'} />, handle: { titleKey: 'settings' } },
        { path: "profile", element: <CompanyProfile />, handle: { titleKey: 'profile' } },
        { path: "student-profile/:id", element: <StudentProfile />, handle: {titleKey: 'profile'} },
        { path: "internships", element: <CompanyInternships />, handle: { titleKey: 'internships' } },
        { path: "internships/:id", element: <CompanyInternship />, handle: { titleKey: 'internship' } },
      ]
    },
    {
      path: '/admin',
      element: <DICLayout />,
      children: [
        { index: true, element: <Navigate to="/admin/announcementRequests" />, handle: { titleKey: 'announcements' } },
        { path: "settings", element: <Settings apiUrl={'http://localhost:3003'} />, handle: { titleKey: 'settings' } },
        { path: "companyRequests", element: <CompanyCards />, handle: { titleKey: 'pendingCompanyRequest' } },
        { path: 'announcementRequests', element: <DICAnnouncementRequest />, handle: { titleKey: 'announcementHeader' } },
        { path: 'announcement/:id', element: <DICAnouncementDetails />, handle: { titleKey: 'announcement' } },
        { path: 'applicationRequests', element: <DICApplications />, handle: { titleKey: 'applicationRequests' } },
        { path: 'application/:id', element: <DICInnerApplication />, handle: { titleKey: 'application' } },
        { path: 'internships', element: <DICInternships />, handle: { titleKey: 'internships' } },
        { path: 'internship/:id', element: <DICInnerInternships />, handle: { titleKey: 'internship' } }
      ]
    },    
    {
      path: '/secretary',
      element: <SecretaryLayout />,
      children: [
        { index: true, element: <Navigate to="home" replace />, handle: { titleKey: 'home' } },
        { path: "home", element: <PendingApplicationList />, handle: { titleKey: 'home' }},
        { path: "settings", element: <Settings apiUrl= 'http://localhost:3006' />, handle: { titleKey: 'settings' } },
      ]
    },
    {
      path: '*',
      element: <NotFound />,
      handle: { titleKey: 'notFound' }
    }
  ]);

  return (
    <RouterProvider router={routes} />
  );
};

export default App;
