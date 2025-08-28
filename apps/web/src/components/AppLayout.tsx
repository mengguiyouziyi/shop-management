import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const { pathname } = useLocation();

  const nameMap: Record<string, string> = {
    '/': '首页',
    '/members': '会员管理',
    '/products': '商品管理',
    '/orders': '订单',
    '/orders/pos': 'POS 收银',
    '/finance': '财务',
    '/finance/daily': '财务日报',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ 
          flex: 1, 
          padding: '24px', 
          background: '#f5f5f5',
          overflow: 'auto'
        }}>
          <h1 style={{ marginBottom: '24px', color: '#333' }}>
            {nameMap[pathname] || '店铺管理系统'}
          </h1>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;