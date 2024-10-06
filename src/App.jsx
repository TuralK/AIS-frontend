import React from "react";
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { AuthLayout } from "./layouts/AuthLayout";
import Login from "./pages/auth_pages/Login/Login";
import ChangePassword from "./pages/auth_pages/ChangePassword/ChangePassword";
import SignUp from "./pages/auth_pages/SignUp/SignUp";

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
    }
  ]);

  return (
    <RouterProvider router={routes} />
  );
};

export default App;
