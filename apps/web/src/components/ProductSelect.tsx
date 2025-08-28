import React, { useState, useEffect } from 'react';
import { Select } from 'tdesign-react';
import { Product } from '../types/shop';

interface ProductSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductSelect({ value, onChange }: ProductSelectProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 模拟获取商品列表
    setProducts([
      { id: '1', name: '苹果', category: '水果', price: 5.5, stock: 100 },
      { id: '2', name: '香蕉', category: '水果', price: 3.8, stock: 150 }
    ]);
  }, []);

  const options = products.map(product => ({
    label: `${product.name} - ¥${product.price}`,
    value: product.id
  }));

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder="选择商品"
      style={{ width: '100%' }}
    />
  );
}