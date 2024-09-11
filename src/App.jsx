import React from "react";
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthLayout } from "./layouts/AuthLayout";
import Login from "./pages/auth_pages/Login/Login";

const App = () => {
  
  const routes = createBrowserRouter([
    { 
      path: '/',
      element: <Login />
    }  
  ]);

  return (
    <RouterProvider router={routes} />
  );
};

export default App;