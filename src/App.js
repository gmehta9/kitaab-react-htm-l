import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.scss';
import React, { Suspense } from 'react';
import PagesLayout from './pages/PagesLayout';

import HomePage from './pages/Home';
import Login from './pages/onboarding/Login';
import ForgotPassword from './pages/onboarding/ForgotPassword';
import SignUp from './pages/onboarding/SignUp';

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <PagesLayout />,
      children: [
        {
          path: '',
          element: <HomePage />
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'forgot-password',
          element: <ForgotPassword />,
        },
        {
          path: 'sign-up',
          element: <SignUp />,
        },
      ]
    },


    {
      path: "*",
      element: '<NotFoundPage />',
    }

  ]);

  return (
    <React.StrictMode>
      <Suspense fallback={'Loading...'}>
        <RouterProvider
          router={router}
        />
      </Suspense>
    </React.StrictMode>
  );
}

export default App;
