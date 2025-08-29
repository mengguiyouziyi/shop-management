import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import SimpleLayout from './components/SimpleLayout';
import ProtectedRoute from './components/ProtectedRoute';

const LoginPage = lazy(() => import('./pages/login'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const MembersPage = lazy(() => import('./pages/members/final'));
const ProductsPage = lazy(() => import('./pages/products/final'));
const POSPage = lazy(() => import('./pages/orders/pos'));
const DailyFinancePage = lazy(() => import('./pages/finance/daily'));
const RolesPage = lazy(() => import('./pages/roles/index'));
const DataExportPage = lazy(() => import('./pages/data-export/index'));
const StoresPage = lazy(() => import('./pages/stores/index'));
const SuppliersPage = lazy(() => import('./pages/suppliers/index'));
const PurchaseOrdersPage = lazy(() => import('./pages/purchase-orders/index'));
const InventoryPage = lazy(() => import('./pages/inventory/index'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SimpleLayout />,
    errorElement: <div>页面加载失败，请刷新重试</div>,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
        errorElement: <div>页面加载失败，请刷新重试</div>
      },
      { 
        path: 'members', 
        element: (
          <ProtectedRoute requiredRole="cashier">
            <MembersPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'products', 
        element: (
          <ProtectedRoute requiredRole="inventory">
            <ProductsPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'orders/pos', 
        element: (
          <ProtectedRoute requiredRole="cashier">
            <POSPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'finance/daily', 
        element: (
          <ProtectedRoute requiredRole="finance">
            <DailyFinancePage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'roles', 
        element: (
          <ProtectedRoute requiredRole="admin">
            <RolesPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'data', 
        element: (
          <ProtectedRoute requiredRole="admin">
            <DataExportPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'stores', 
        element: (
          <ProtectedRoute requiredRole="admin">
            <StoresPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'suppliers', 
        element: (
          <ProtectedRoute requiredRole="inventory">
            <SuppliersPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'purchase-orders', 
        element: (
          <ProtectedRoute requiredRole="inventory">
            <PurchaseOrdersPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      },
      { 
        path: 'inventory', 
        element: (
          <ProtectedRoute requiredRole="inventory">
            <InventoryPage />
          </ProtectedRoute>
        ), 
        errorElement: <div>页面加载失败，请刷新重试</div> 
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <div>页面加载失败，请刷新重试</div>
  }
]);