import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PermissionService } from '../services/permission';
import OfflineIndicator from './OfflineIndicator';
import { useNetworkStore } from '../services/network';
import { useAppStore } from '../store/useAppStore';

export default function SimpleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const permissionService = PermissionService.getInstance();
  const currentUser = permissionService.getCurrentUser();
  const { isOnline } = useNetworkStore();
  const { currentStore } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    menuItems.push({ path: '/stores', label: '店铺管理' });
    menuItems.push({ path: '/reports/sales', label: '销售报表' });
    menuItems.push({ path: '/reports/inventory', label: '库存报表' });
  }

  // 库存管理员额外菜单项
  if (currentUser?.role === 'inventory') {
    menuItems.push({ path: '/suppliers', label: '供应商管理' });
    menuItems.push({ path: '/purchase-orders', label: '采购订单' });
    menuItems.push({ path: '/inventory', label: '库存管理' });
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false); // 关闭移动端菜单
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>店铺管理系统</h1>
          {currentStore && (
            <div style={{ 
              fontSize: '12px', 
              background: '#1890ff', 
              padding: '2px 8px', 
              borderRadius: '4px' 
            }}>
              {currentStore.name}
            </div>
          )}
        </div>
        {currentUser && (
          <div style={{ fontSize: '14px' }}>
            欢迎, {currentUser.role === 'admin' ? '管理员' : 
                   currentUser.role === 'cashier' ? '收银员' :
                   currentUser.role === 'inventory' ? '库存管理员' : '财务人员'}
          </div>
        )}
      </div>
      
      {/* 移动端菜单按钮 */}
      <button 
        className="mobile-menu-button"
        onClick={toggleMobileMenu}
        style={{ 
          position: 'fixed', 
          top: '70px', 
          left: '20px', 
          zIndex: 1000 
        }}
      >
        ☰ 菜单
      </button>
      
      <div style={{ display: 'flex' }}>
        {/* 桌面端菜单 */}
        <div className="desktop-menu">
          {menuItems.map(item => (
            <div 
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </div>
          ))}
        </div>
        
        {/* 移动端菜单 */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {menuItems.map(item => (
            <div 
              key={item.path}
              className={`mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
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