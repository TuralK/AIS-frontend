import React from "react";
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { AuthLayout } from "./layouts/AuthLayout";
import './utils/translatePage.js';

import Login from "./pages/auth_pages/Login/Login";
import ChangePassword from "./pages/auth_pages/ChangePassword/ChangePassword";
import SignUp from "./pages/auth_pages/SignUp/SignUp";
import { StudentLayout } from "./layouts/StudentLayout/StudentLayout.jsx";
import Home from "./components/StudentComponents/StudentHomePageComponent/StudentHomePage.jsx";

const App = () => {
  
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
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/student',
      element: <StudentLayout />,
      children: [
        {index: true, element: <Home/>},
        {path: "home", element: <Home/>}
      ]
      // children: [
      //   {index: true, element: },
      //   {path: "home", element: },
      //   {path: "announcements", element: },
      //   {path: "applications", element: }
      //   {path: "notifications", element: },
      //   {path: "profile", element: }
      //   {path: "settings", element: }
      // ]
    }
  ]);

  return (
    <RouterProvider router={routes} />
  );
};

export default App;
