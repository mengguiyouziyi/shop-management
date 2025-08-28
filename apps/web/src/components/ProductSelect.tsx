import { Select, Option } from 'tdesign-react';
import { useEffect, useState } from 'react';
import { getProducts } from '../services/product';

export default function ProductSelect({ value, onChange }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data));
  }, []);

  return (
    <Select value={value} onChange={onChange}>
      {products.map(product => (
        <Option key={product.id} value={product.id} label={product.name}>
          {product.name} - ¥{product.price}
        </Option>
      ))}
    </Select>
  );
}