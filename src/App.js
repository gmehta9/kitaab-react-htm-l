import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import './App.scss';
import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import PagesLayout from './pages/PagesLayout';

import HomePage from './pages/Home';

import OrderHistory from './pages/myAccount/OrderHistory';
import MyAccountLayoutPage from './pages/myAccount/MyAccountLayout';

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
import CartPage from './pages/CartPage';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/myAccount/Wishlist';

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
        // {
        //   path: 'login',
        //   element: <Login />,
        // },
        // {
        //   path: 'forgot-password',
        //   element: <ForgotPassword />,
        // },
        {
          path: 'cart',
          element: <CartPage />,
        },
        {
          path: 'order-success',
          element: <OrderSuccess />,
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
          element: <MyAccountLayoutPage />,
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
            {
              path: 'sell-history',
              element: <OrderHistory />,
            },
            {
              path: 'wishlist',
              element: <Wishlist />,
            },
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

        <Toaster
          position="top-center"
          toastOptions={{
            // Define default options

            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }} />
        {/* <MainProvider> */}
        <RouterProvider
          router={router}
        />
        {/* </MainProvider> */}
      </Suspense>
    </React.StrictMode>
  );
}

export default App;
