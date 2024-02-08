import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import './App.scss';
import React, { Suspense } from 'react';
import PagesLayout from './pages/PagesLayout';

import HomePage from './pages/Home';
import Login from './pages/onboarding/Login';
import ForgotPassword from './pages/onboarding/ForgotPassword';
import SignUp from './pages/onboarding/SignUp';
import MyAccountLayout from './pages/MyAccount/MyAccountLayout';
import OrderHistory from './pages/MyAccount/OrderHistory';
import Chat from './pages/MyAccount/Chat';
import Wishlist from './pages/MyAccount/Wishlist';
import ProfilePage from './pages/MyAccount/ProfilePage';

function App() {
  const router = createHashRouter([
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

        {
          path: 'account',
          element: <MyAccountLayout />,
          children: [
            {
              path: 'profile',
              element: <ProfilePage />,
            },
            {
              path: 'order-history',
              element: <OrderHistory />,
            },
            {
              path: 'chat',
              element: <Chat />,
            },
            {
              path: 'wishlist',
              element: <Wishlist />,
            },

          ]
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
