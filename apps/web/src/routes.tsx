import { lazy, Suspense } from 'react';
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
const StoreHierarchyPage = lazy(() => import('./pages/stores/hierarchy'));
const SuppliersPage = lazy(() => import('./pages/suppliers/index'));
const PurchaseOrdersPage = lazy(() => import('./pages/purchase-orders/index'));
const InventoryPage = lazy(() => import('./pages/inventory/index'));
const SalesReportPage = lazy(() => import('./pages/reports/sales'));
const InventoryReportPage = lazy(() => import('./pages/reports/inventory'));
const CrossStoreReportPage = lazy(() => import('./pages/reports/crossStore'));
const ResourceSharingPage = lazy(() => import('./pages/resource-sharing/index'));
const MobilePosPage = lazy(() => import('./pages/mobile-pos/index'));

// Loading component
const LoadingComponent = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    页面加载中...
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SimpleLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'members', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="cashier">
              <MembersPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'products', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="inventory">
              <ProductsPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'orders/pos', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="cashier">
              <POSPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'finance/daily', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="finance">
              <DailyFinancePage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'roles', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="admin">
              <RolesPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'data', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="admin">
              <DataExportPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'stores', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="admin">
              <StoresPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'stores/hierarchy', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="admin">
              <StoreHierarchyPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'suppliers', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="inventory">
              <SuppliersPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'purchase-orders', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="inventory">
              <PurchaseOrdersPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'inventory', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="inventory">
              <InventoryPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'reports/sales', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="admin">
              <SalesReportPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'reports/inventory', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="admin">
              <InventoryReportPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'reports/cross-store', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="admin">
              <CrossStoreReportPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'resource-sharing', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="admin">
              <ResourceSharingPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: 'mobile-pos', 
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute requiredRole="cashier">
              <MobilePosPage />
            </ProtectedRoute>
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <LoginPage />
      </Suspense>
    )
  }
]);