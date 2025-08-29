import { useState } from 'react';
import { ProductList } from '../../components/product/ProductList';
import { CreateProductForm } from '../../components/product/CreateProductForm';
import { Button, Space } from 'tdesign-react';

export default function ProductsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="page-container">
      <h1 className="page-title">商品管理</h1>
      <div className="card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">商品列表</h2>
            <Button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
              {showForm ? '隐藏表单' : '创建商品'}
            </Button>
          </div>
          
          {showForm && (
            <div className="card">
              <h3 className="text-lg font-bold mb-4">创建新商品</h3>
              <CreateProductForm onCreated={() => {
                setRefreshKey(k => k + 1);
                setShowForm(false);
              }} />
            </div>
          )}
          
          <ProductList key={refreshKey} />
        </Space>
      </div>
    </div>
  );
}