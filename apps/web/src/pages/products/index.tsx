import { useState } from 'react';
import { ProductList } from '../../components/product/ProductList';
import { CreateProductForm } from '../../components/product/CreateProductForm';
import { Button, Space } from 'tdesign-react';

export default function ProductsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="page-container">
      <h1>商品管理</h1>
      <Space direction="vertical" size="large">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '隐藏表单' : '创建商品'}
        </Button>
        
        {showForm && (
          <CreateProductForm onCreated={() => {
            setRefreshKey(k => k + 1);
            setShowForm(false);
          }} />
        )}
        
        <ProductList key={refreshKey} />
      </Space>
    </div>
  );
}
