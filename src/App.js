import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import './App.scss';
import React, { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import PagesLayout from './pages/PagesLayout';
import HomePage from './pages/Home';
import MyAccountLayoutPage from './pages/myAccount/MyAccountLayout';
import Loader from './components/Loader';

import ProductModuleLayout from './pages/productModule/ProductModuleLayout';

const ProfilePage = lazy(() => import('./pages/myAccount/ProfilePage'));

const ProductByList = lazy(() => import('./pages/productModule/ProductByList'));
const ProductByID = lazy(() => import('./pages/productModule/ProductByID'));
const ChatLayout = lazy(() => import('./pages/chat/ChatLayout'));
const Chat = lazy(() => import('./pages/chat/Chat'));
// const ManageAddress = lazy(() => import('./pages/myAccount/ManageAddress'));
const ProductForm = lazy(() => import('./pages/productModule/ProductForm'));
const CartPage = lazy(() => import('./pages/orderPlaced/CartPage'));
// const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Wishlist = lazy(() => import('./pages/myAccount/Wishlist'));
const SellBuyModuleMainLayout = lazy(() => import('./pages/myAccount/sellBuyModule/SellBuyModuleMainLayout'));

const AboutPage = lazy(() => import('./pages/innerpages/About'));
const InnerPageLayout = lazy(() => import('./pages/innerpages/InnerPageLayout'));
const FAQPage = lazy(() => import('./pages/innerpages/FAQ'));
const ContactPage = lazy(() => import('./pages/innerpages/Contact'));


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
        // {
        //   path: 'order-success',
        //   element: <OrderSuccess />,
        // },

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
            // {
            //   path: 'manage-address',
            //   element: <ManageAddress />,
            // },
            {
              path: 'order-history',
              element: <SellBuyModuleMainLayout />,
            },
            {
              path: 'sell-history',
              element: <SellBuyModuleMainLayout />,
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
        {
          path: '',
          element: <InnerPageLayout />,
          children: [
            {
              path: 'about-us',
              element: <AboutPage />
            },
            {
              path: 'contact-us',
              element: <ContactPage />
            },
            {
              path: 'faq',
              element: <FAQPage />
            }
          ]
        }

      ]
    },

    {
      path: "*",
      element: '<NotFoundPage />',
    }

  ]
    // ,
    //  { basename: ['live', 'local'].includes(process.env.REACT_APP_ENV) ? "" : "/kitaab-portal/api-gateway-hub/", }
  );

  return (
    <React.StrictMode>
      <Suspense fallback={<Loader />}>

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
