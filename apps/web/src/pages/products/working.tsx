import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Card, Input, Dialog } from 'tdesign-react';
import { ShopIcon, EditIcon, DeleteIcon, PlusIcon } from 'tdesign-icons-react';
import { productColumns } from './columns';
import { useAppStore } from '../../store/useAppStore';

export default function ProductsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { products, deleteProduct: deleteProductFromStore, addProduct } = useAppStore();

  // Initialize sample data if empty
  useEffect(() => {
    if (products.length === 0) {
      console.log('初始化示例数据');
      addProduct({
        name: '苹果',
        category: '水果',
        unit: 'piece',
        price: 5.5,
        cost: 3.0,
        stock: 100,
        minStock: 10,
        isActive: true,
        description: '新鲜苹果'
      });
      
      addProduct({
        name: '香蕉',
        category: '水果',
        unit: 'piece',
        price: 3.8,
        cost: 2.0,
        stock: 150,
        minStock: 20,
        isActive: true,
        description: '进口香蕉'
      });
    }
  }, [products.length, addProduct]);

  const handleDelete = async (id: string) => {
    try {
      console.log('删除产品:', id);
      deleteProductFromStore(id);
      setDeleteId(null);
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  console.log('当前产品数量:', products.length);
  console.log('搜索词:', searchTerm);

  return (
    <div>
      <h1>商品管理</h1>
      <p>当前产品数量: {products.length}</p>
      <input 
        type="text"
        placeholder="搜索商品"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '300px', margin: '10px 0' }}
      />
      <div>
        {products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px 0' }}>
            <h3>{product.name}</h3>
            <p>分类: {product.category}</p>
            <p>价格: ¥{product.price}</p>
            <p>库存: {product.stock}</p>
            <button onClick={() => setDeleteId(product.id)}>删除</button>
          </div>
        ))}
      </div>
      
      {deleteId && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>确认删除</h3>
          <p>确定要删除这个商品吗？</p>
          <button onClick={() => setDeleteId(null)}>取消</button>
          <button onClick={() => deleteId && handleDelete(deleteId)}>确认</button>
        </div>
      )}
    </div>
  );
}