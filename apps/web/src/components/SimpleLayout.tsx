import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PermissionService } from '../services/permission';
import OfflineIndicator from './OfflineIndicator';
import { useNetworkStore } from '../services/network';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../hooks/useAuth';

interface MenuItem {
  path: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  roles?: string[];
}

interface MenuCategory {
  label: string;
  icon: string;
  items: MenuItem[];
}

export default function SimpleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const permissionService = PermissionService.getInstance();
  const currentUser = permissionService.getCurrentUser();
  const { user } = useAuth();
  const { isOnline } = useNetworkStore();
  const { currentStore } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 如果用户未登录且不在登录页面，重定向到登录页面
  React.useEffect(() => {
    if (!currentUser && !location.pathname.startsWith('/login')) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, location.pathname, navigate]);

  const handleLogout = () => {
    // 清除权限服务中的用户数据
    permissionService.logout();
    
    // 清除 localStorage 中的用户数据
    localStorage.removeItem('user');
    
    // 跳转到登录页面
    navigate('/login');
  };

  // 菜单分类配置
  const menuCategories: MenuCategory[] = [
    {
      label: '核心业务',
      icon: '🏪',
      items: [
        { path: '/', label: '首页', icon: '🏠' },
        { path: '/members', label: '会员管理', icon: '👥' },
        { path: '/products', label: '商品管理', icon: '📦' },
        { path: '/orders/pos', label: 'POS收银', icon: '💰' },
      ]
    },
    {
      label: '财务管理',
      icon: '💵',
      items: [
        { path: '/finance/daily', label: '财务日报', icon: '📊', roles: ['finance', 'admin'] },
      ]
    },
    {
      label: '库存管理',
      icon: '📋',
      items: [
        { path: '/suppliers', label: '供应商管理', icon: '🏭', roles: ['inventory', 'admin'] },
        { path: '/purchase-orders', label: '采购订单', icon: '📝', roles: ['inventory', 'admin'] },
        { path: '/inventory', label: '库存管理', icon: '🗃️', roles: ['inventory', 'admin'] },
      ]
    },
    {
      label: '报表分析',
      icon: '📈',
      items: [
        { path: '/reports/sales', label: '销售报表', icon: '💹', roles: ['admin'] },
        { path: '/reports/inventory', label: '库存报表', icon: '📊', roles: ['admin'] },
        { path: '/reports/cross-store', label: '跨店铺报表', icon: '🔄', roles: ['admin'] },
      ]
    },
    {
      label: '系统管理',
      icon: '⚙️',
      items: [
        { path: '/roles', label: '角色管理', icon: '👤', roles: ['admin'] },
        { path: '/data', label: '数据管理', icon: '💾', roles: ['admin'] },
        { path: '/stores', label: '店铺管理', icon: '🏬', roles: ['admin'] },
        { path: '/stores/hierarchy', label: '店铺层级', icon: '🏗️', roles: ['admin'] },
        { path: '/resource-sharing', label: '资源共享', icon: '🔄', roles: ['admin'] },
        { path: '/headquarters-branch', label: '总部-分店管理', icon: '🏢', roles: ['admin'] },
        { path: '/system-settings', label: '系统设置', icon: '⚙️', roles: ['admin'] },
        { path: '/health-check', label: '健康检查', icon: '❤️', roles: ['admin'] },
      ]
    },
    {
      label: '其他功能',
      icon: '🔧',
      items: [
        { path: '/mobile-pos', label: '移动POS', icon: '📱', roles: ['cashier'] },
      ]
    },
    {
      label: '帮助支持',
      icon: '❓',
      items: [
        { path: '/help', label: '帮助文档', icon: '📚' },
        { path: '/changelog', label: '更新日志', icon: '📝' },
        { path: '/about', label: '关于系统', icon: 'ℹ️' },
        { path: '/feedback', label: '用户反馈', icon: '💬' },
      ]
    }
  ];

  // 根据用户角色过滤菜单项
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(currentUser?.role || '');
    });
  };

  // 过滤菜单分类
  const filteredMenuCategories = menuCategories
    .map(category => ({
      ...category,
      items: filterMenuItems(category.items)
    }))
    .filter(category => category.items.length > 0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigation = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    navigate(normalizedPath);
    setMobileMenuOpen(false);
  };

  // 检查路径是否激活
  const isPathActive = (path: string) => {
    if (location.pathname === path) {
      return true;
    }
    
    // 对于有子页面的路径，只有当完全匹配时才激活
    const hasChildPages = ['/stores', '/reports', '/system'].some(p => path.startsWith(p));
    if (hasChildPages) {
      return location.pathname === path;
    }
    
    return location.pathname.startsWith(path + '/');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '14px', color: 'white' }}>
              欢迎, {user?.name || currentUser.role === 'admin' ? '管理员' : 
                     currentUser.role === 'cashier' ? '收银员' :
                     currentUser.role === 'inventory' ? '库存管理员' : '财务人员'}
            </div>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              title="退出登录"
            >
              退出登录
            </button>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex' }}>
        {/* 左侧菜单栏 */}
        <div style={{ 
          width: sidebarCollapsed ? '80px' : '260px', 
          backgroundColor: '#001529',
          minHeight: 'calc(100vh - 60px)',
          transition: 'width 0.3s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}>
          {/* 展开/收缩按钮 */}
          <button 
            onClick={toggleSidebar}
            style={{
              position: 'absolute',
              top: sidebarCollapsed ? '16px' : '56px',
              right: '16px',
              backgroundColor: sidebarCollapsed ? 'rgba(255, 255, 255, 0.1)' : 'rgba(24, 144, 255, 0.2)',
              color: 'white',
              border: sidebarCollapsed ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(24, 144, 255, 0.3)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              zIndex: 10,
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)'
            }}
            title={sidebarCollapsed ? '展开菜单' : '收缩菜单'}
            onMouseEnter={(e) => {
              if (sidebarCollapsed) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
              } else {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(24, 144, 255, 0.3)';
                (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (sidebarCollapsed) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              } else {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(24, 144, 255, 0.2)';
                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              }
            }}
          >
            {sidebarCollapsed ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 12l4-4-4-4v8z"/>
                </svg>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M10 12l-4-4 4-4v8z"/>
                </svg>
              </span>
            )}
          </button>

          {/* 汉堡菜单按钮（移动端） */}
          <button 
            onClick={toggleMobileMenu}
            style={{ 
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: sidebarCollapsed ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: 'white',
              border: sidebarCollapsed ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
              fontSize: '14px',
              cursor: 'pointer',
              zIndex: 9,
              display: sidebarCollapsed ? 'flex' : 'none',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.3s',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              if (sidebarCollapsed) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (sidebarCollapsed) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z"/>
            </svg>
          </button>
          
          <div style={{ padding: '60px 0 20px 0', overflowY: 'auto', height: 'calc(100vh - 60px)' }}>
            {filteredMenuCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} style={{ marginBottom: '8px' }}>
                {/* 分类标题 */}
                {!sidebarCollapsed && (
                  <div style={{ 
                    padding: '12px 24px 8px 24px',
                    color: '#8c8c8c',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '14px' }}>{category.icon}</span>
                    <span>{category.label}</span>
                  </div>
                )}
                
                {/* 分类项 */}
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    onClick={() => handleNavigation(item.path)}
                    style={{
                      padding: sidebarCollapsed ? '16px 8px' : '12px 24px',
                      cursor: 'pointer',
                      backgroundColor: isPathActive(item.path) ? '#1890ff' : 'transparent',
                      color: isPathActive(item.path) ? 'white' : '#d9d9d9',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: sidebarCollapsed ? '0' : '12px',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      position: 'relative',
                      fontSize: '14px',
                      borderRadius: sidebarCollapsed ? '8px' : '0',
                      margin: sidebarCollapsed ? '4px 8px' : '0',
                      borderLeft: isPathActive(item.path) && !sidebarCollapsed ? '3px solid #fff' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isPathActive(item.path)) {
                        const element = e.target as HTMLDivElement;
                        element.style.backgroundColor = '#1890ff20';
                        element.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isPathActive(item.path)) {
                        const element = e.target as HTMLDivElement;
                        element.style.backgroundColor = 'transparent';
                        element.style.color = '#d9d9d9';
                      }
                    }}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <span style={{ 
                      fontSize: '18px', 
                      filter: isPathActive(item.path) ? 'none' : 'grayscale(50%)',
                      transition: 'filter 0.2s'
                    }}>
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <span style={{ 
                        fontWeight: isPathActive(item.path) ? '600' : '400',
                        transition: 'font-weight 0.2s'
                      }}>
                        {item.label}
                      </span>
                    )}
                    {isPathActive(item.path) && !sidebarCollapsed && (
                      <div style={{
                        position: 'absolute',
                        right: '24px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '4px',
                        backgroundColor: '#fff',
                        borderRadius: '50%'
                      }} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* 移动端菜单覆盖层 */}
        {mobileMenuOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 998
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* 移动端菜单 */}
        <div style={{ 
          position: 'fixed',
          left: mobileMenuOpen ? '0' : '-300px',
          top: '60px',
          width: '300px',
          height: 'calc(100vh - 60px)',
          backgroundColor: '#001529',
          zIndex: 999,
          transition: 'left 0.3s ease-in-out',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}>
          <div style={{ padding: '20px 0' }}>
            {filteredMenuCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} style={{ marginBottom: '20px' }}>
                <div style={{ 
                  padding: '12px 24px 8px 24px',
                  color: '#8c8c8c',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '14px' }}>{category.icon}</span>
                  <span>{category.label}</span>
                </div>
                
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    onClick={() => handleNavigation(item.path)}
                    style={{
                      padding: '12px 24px',
                      cursor: 'pointer',
                      backgroundColor: isPathActive(item.path) ? '#1890ff' : 'transparent',
                      color: isPathActive(item.path) ? 'white' : '#d9d9d9',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      borderLeft: isPathActive(item.path) ? '3px solid #fff' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isPathActive(item.path)) {
                        const element = e.target as HTMLDivElement;
                        element.style.backgroundColor = '#1890ff20';
                        element.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isPathActive(item.path)) {
                        const element = e.target as HTMLDivElement;
                        element.style.backgroundColor = 'transparent';
                        element.style.color = '#d9d9d9';
                      }
                    }}
                  >
                    <span style={{ 
                      fontSize: '18px', 
                      filter: isPathActive(item.path) ? 'none' : 'grayscale(50%)'
                    }}>
                      {item.icon}
                    </span>
                    <span style={{ fontWeight: isPathActive(item.path) ? '600' : '400' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div style={{ 
          flex: 1, 
          background: '#f5f7fa',
          minHeight: 'calc(100vh - 60px)',
          overflow: 'auto'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}