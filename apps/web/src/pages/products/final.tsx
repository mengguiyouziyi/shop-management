import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function ProductsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { products, deleteProduct: deleteProductFromStore, addProduct } = useAppStore();

  // Initialize sample data if empty
  useEffect(() => {
    if (products.length === 0) {
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
      
      addProduct({
        name: '橙子',
        category: '水果',
        unit: 'piece',
        price: 4.2,
        cost: 2.5,
        stock: 80,
        minStock: 15,
        isActive: true,
        description: '甜橙'
      });
    }
  }, [products.length, addProduct]);

  const handleDelete = async (id: string) => {
    try {
      deleteProductFromStore(id);
      setDeleteId(null);
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  return (
    <div>
      <h2>商品管理</h2>
      <p>当前商品数量: {products.length}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="搜索商品名称或分类"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '300px', 
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div>
        {products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(product => (
          <div key={product.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            margin: '10px 0',
            borderRadius: '8px',
            background: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                <p style={{ margin: '5px 0' }}>分类: {product.category}</p>
                <p style={{ margin: '5px 0' }}>价格: ¥{product.price}</p>
                <p style={{ margin: '5px 0' }}>成本: ¥{product.cost}</p>
                <p style={{ margin: '5px 0' }}>库存: {product.stock}</p>
                <p style={{ margin: '5px 0' }}>状态: {product.isActive ? '在售' : '停售'}</p>
                {product.description && (
                  <p style={{ margin: '5px 0' }}>描述: {product.description}</p>
                )}
              </div>
              <button 
                onClick={() => setDeleteId(product.id)}
                style={{ 
                  padding: '8px 16px',
                  background: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {deleteId && (
        <div style={{ 
          position: 'fixed', 
          top: '0', 
          left: '0', 
          right: '0',
          bottom: '0',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h3>确认删除</h3>
            <p>确定要删除这个商品吗？删除后无法恢复。</p>
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setDeleteId(null)}
                style={{ 
                  marginRight: '10px',
                  padding: '8px 16px',
                  background: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button 
                onClick={() => deleteId && handleDelete(deleteId)}
                style={{ 
                  padding: '8px 16px',
                  background: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}