import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import './App.scss';
import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import PagesLayout from './pages/PagesLayout';

import HomePage from './pages/Home';
import Login from './pages/onboarding/Login';
import ForgotPassword from './pages/onboarding/ForgotPassword';
import SignUp from './pages/onboarding/SignUp';
// import MyAccountLayout from './pages/MyAccount/MyAccountLayout';
import OrderHistory from './pages/myAccount/OrderHistory';

// import Wishlist from './pages/MyAccount/Wishlist';
import ProfilePage from './pages/myAccount/ProfilePage';
import ProductModuleLayout from './pages/ProductModule/ProductModuleLayout';
import ProductByList from './pages/ProductModule/ProductByList';
import ProductByID from './pages/ProductModule/ProductByID';
import ChatLayout from './pages/chat/ChatLayout';
import Chat from './pages/chat/Chat';
import ManageAddress from './pages/myAccount/ManageAddress';
import MyReviewsRatings from './pages/myAccount/MyReviewsRatings';
import MyCoupons from './pages/myAccount/MyCoupons';
import ProductForm from './pages/ProductModule/ProductForm';

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
          path: 'product',
          element: <ProductModuleLayout />,
          children: [
            {
              path: '',
              element: <ProductByList />,
            },
            {
              path: 'add',
              element: <ProductForm />,
            },
            {
              path: 'edit',
              element: <ProductForm />,
            },
            {
              path: 'product-detail',
              element: <ProductByID />,
            },
          ]
        },
        {
          path: 'account',
          // element: <MyAccountLayout />,
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
              path: 'manage-address',
              element: <ManageAddress />,
            },
            {
              path: 'my-coupons',
              element: <MyCoupons />,
            },
            {
              path: 'my-reviews-ratings',
              element: <MyReviewsRatings />,
            },
            {
              path: 'order-history',
              element: <OrderHistory />,
            },
            // {
            //   path: 'wishlist',
            //   element: <Wishlist />,
            // },
          ]
        },
        {
          path: 'chat',
          element: <ChatLayout />,
          children: [
            {
              path: '',
              element: <Chat />,
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
        <Toaster />
        <RouterProvider
          router={router}
        />
      </Suspense>
    </React.StrictMode>
  );
}

export default App;
