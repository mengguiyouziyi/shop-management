import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import SimpleLayout from './components/SimpleLayout';

const LoginPage = lazy(() => import('./pages/login'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const MembersPage = lazy(() => import('./pages/members/final'));
const ProductsPage = lazy(() => import('./pages/products/final'));
const POSPage = lazy(() => import('./pages/orders/pos'));
const DailyFinancePage = lazy(() => import('./pages/finance/daily'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SimpleLayout />,
    errorElement: <div>页面加载失败，请刷新重试</div>,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        errorElement: <div>页面加载失败，请刷新重试</div>
      },
      { path: 'members', element: <MembersPage />, errorElement: <div>页面加载失败，请刷新重试</div> },
      { path: 'products', element: <ProductsPage />, errorElement: <div>页面加载失败，请刷新重试</div> },
      { path: 'orders/pos', element: <POSPage />, errorElement: <div>页面加载失败，请刷新重试</div> },
      { path: 'finance/daily', element: <DailyFinancePage />, errorElement: <div>页面加载失败，请刷新重试</div> }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <div>页面加载失败，请刷新重试</div>
  }
]);