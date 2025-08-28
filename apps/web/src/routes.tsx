import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/AppLayout';

const LoginPage = lazy(() => import('./pages/login'));
const DashboardPage = lazy(() => import('./pages/dashboard').then(m => ({ default: m.default })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
]);