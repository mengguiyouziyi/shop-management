import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/products';
import PosPage from './pages/pos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/pos" element={<PosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;