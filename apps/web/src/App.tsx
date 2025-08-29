import { createBrowserRouter } from 'react-router-dom';
import ProductsPage from './pages/products';
import PosPage from './pages/pos';

const router = createBrowserRouter([
  {
    path: "/products",
    element: <ProductsPage />
  },
  {
    path: "/pos",
    element: <PosPage />
  }
]);

export { router };
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {
  return <RouterProvider router={router} />;
}

export default App;