import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function SimpleLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', label: '首页' },
    { path: '/members', label: '会员管理' },
    { path: '/products', label: '商品管理' },
    { path: '/orders/pos', label: 'POS收银' },
    { path: '/finance/daily', label: '财务日报' }
  ];

  return (
    <div>
      <div style={{ 
        height: '60px', 
        background: '#001529', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <h1 style={{ margin: 0, fontSize: '18px' }}>店铺管理系统</h1>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ 
          width: '200px', 
          background: '#001529',
          minHeight: 'calc(100vh - 60px)',
          padding: '20px 0'
        }}>
          {menuItems.map(item => (
            <div 
              key={item.path}
              style={{ 
                color: 'white', 
                padding: '10px 20px', 
                cursor: 'pointer',
                background: window.location.pathname === item.path ? '#1890ff' : 'transparent'
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (window.location.pathname !== item.path) {
                  e.currentTarget.style.background = '#333';
                }
              }}
              onMouseLeave={(e) => {
                if (window.location.pathname !== item.path) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#f0f2f5' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}