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
    menuItems.push({ path: '/stores/hierarchy', label: '店铺层级' });
    menuItems.push({ path: '/reports/sales', label: '销售报表' });
    menuItems.push({ path: '/reports/inventory', label: '库存报表' });
    menuItems.push({ path: '/reports/cross-store', label: '跨店铺报表' });
    menuItems.push({ path: '/resource-sharing', label: '资源共享' });
    menuItems.push({ path: '/headquarters-branch', label: '总部-分店管理' });
  }

  // 库存管理员额外菜单项
  if (currentUser?.role === 'inventory') {
    menuItems.push({ path: '/suppliers', label: '供应商管理' });
    menuItems.push({ path: '/purchase-orders', label: '采购订单' });
    menuItems.push({ path: '/inventory', label: '库存管理' });
  }

  // 所有用户都可以访问帮助文档
  menuItems.push({ path: '/help', label: '帮助文档' });

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
        onClick={toggleMobileMenu}
        style={{ 
          position: 'fixed', 
          top: '70px', 
          left: '20px', 
          zIndex: 1000,
          padding: '8px 12px',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ☰ 菜单
      </button>
      
      <div style={{ display: 'flex' }}>
        {/* 桌面端菜单 */}
        <div style={{ 
          width: '200px', 
          backgroundColor: '#fff', 
          borderRight: '1px solid #eee',
          minHeight: 'calc(100vh - 60px)',
          padding: '20px 0'
        }}>
          {menuItems.map(item => (
            <div 
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                padding: '12px 20px',
                cursor: 'pointer',
                backgroundColor: location.pathname === item.path ? '#e6f7ff' : 'transparent',
                borderLeft: location.pathname === item.path ? '3px solid #1890ff' : '3px solid transparent',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  (e.target as HTMLDivElement).style.backgroundColor = '#f5f7fa';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  (e.target as HTMLDivElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        
        {/* 移动端菜单 */}
        <div style={{ 
          position: 'fixed',
          left: mobileMenuOpen ? '0' : '-250px',
          top: '120px',
          width: '250px',
          height: 'calc(100vh - 120px)',
          backgroundColor: '#fff',
          borderRight: '1px solid #eee',
          zIndex: 999,
          transition: 'left 0.3s ease-in-out',
          overflowY: 'auto'
        }}>
          {menuItems.map(item => (
            <div 
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                padding: '12px 20px',
                cursor: 'pointer',
                backgroundColor: location.pathname === item.path ? '#e6f7ff' : 'transparent',
                borderLeft: location.pathname === item.path ? '3px solid #1890ff' : '3px solid transparent'
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