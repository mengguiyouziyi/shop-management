import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { StorageService } from '../../services/storage';

export default function DataExportPage() {
  const { products, members, orders } = useAppStore();
  const storageService = StorageService.getInstance();

  const exportData = () => {
    const data = {
      products,
      members,
      orders,
      exportTime: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `shop-data-export-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearData = () => {
    if (window.confirm('确定要清空所有数据吗？此操作不可恢复。')) {
      storageService.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>数据管理</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>数据导出</h2>
        <p style={{ marginBottom: '16px' }}>导出所有商品、会员和订单数据为JSON文件</p>
        <button 
          onClick={exportData}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#1890ff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          导出数据
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>数据统计</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, backgroundColor: '#f5f7fa', padding: '16px', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>商品</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1890ff' }}>{products.length}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: '#f5f7fa', padding: '16px', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>会员</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#52c41a' }}>{members.length}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: '#f5f7fa', padding: '16px', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>订单</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#722ed1' }}>{orders.length}</p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>数据清理</h2>
        <p style={{ marginBottom: '16px' }}>清空所有本地存储的数据</p>
        <button 
          onClick={clearData}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ff4d4f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          清空数据
        </button>
      </div>
    </div>
  );
}