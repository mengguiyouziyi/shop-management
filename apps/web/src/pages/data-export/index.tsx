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
    <div className="page-container">
      <h1 className="page-title">数据管理</h1>
      <div className="card">
        <h2>数据导出</h2>
        <p>导出所有商品、会员和订单数据为JSON文件</p>
        <button className="btn btn-primary" onClick={exportData}>
          导出数据
        </button>
      </div>

      <div className="card">
        <h2>数据统计</h2>
        <div className="flex gap-4">
          <div className="card" style={{ flex: 1 }}>
            <h3>商品</h3>
            <p className="text-xl">{products.length}</p>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <h3>会员</h3>
            <p className="text-xl">{members.length}</p>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <h3>订单</h3>
            <p className="text-xl">{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>数据清理</h2>
        <p>清空所有本地存储的数据</p>
        <button className="btn btn-error" onClick={clearData}>
          清空数据
        </button>
      </div>
    </div>
  );
}