import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PermissionService } from '../services/permission';
import OfflineIndicator from './OfflineIndicator';
import { useNetworkStore } from '../services/network';

export default function SimpleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const permissionService = PermissionService.getInstance();
  const currentUser = permissionService.getCurrentUser();
  const { isOnline } = useNetworkStore();

  const menuItems = [
    { path: '/', label: '首页' },
    { path: '/members', label: '会员管理' },
    { path: '/products', label: '商品管理' },
    { path: '/orders/pos', label: 'POS收银' },
    { path: '/finance/daily', label: '财务日报' }
  ];

  // 管理员额外菜单项
  if (currentUser?.role === 'admin') {
    menuItems.push({ path: '/roles', label: '角色管理' });
    menuItems.push({ path: '/data', label: '数据管理' });
  }

  return (
    <div>
      <OfflineIndicator />
      <div style={{ 
        height: '60px', 
        background: '#001529', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        justifyContent: 'space-between',
        marginTop: !location.pathname.startsWith('/login') && !isOnline ? '36px' : '0'
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>店铺管理系统</h1>
        {currentUser && (
          <div style={{ fontSize: '14px' }}>
            欢迎, {currentUser.role === 'admin' ? '管理员' : 
                   currentUser.role === 'cashier' ? '收银员' :
                   currentUser.role === 'inventory' ? '库存管理员' : '财务人员'}
          </div>
        )}
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ 
          width: '200px', 
          background: '#001529',
          minHeight: 'calc(100vh - 60px)',
          padding: '20px 0',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)'
        }}>
          {menuItems.map(item => (
            <div 
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              style={{ 
                color: 'white', 
                padding: '12px 20px', 
                cursor: 'pointer',
                background: location.pathname === item.path ? '#1890ff' : 'transparent',
                transition: 'all 0.3s',
                margin: '4px 8px',
                borderRadius: '4px'
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = '#1f2c3e';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: '#f5f7fa' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}