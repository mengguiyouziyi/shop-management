import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LogoutIcon } from 'tdesign-icons-react';
import { PermissionService } from '../services/permission';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const permissionService = PermissionService.getInstance();

  const handleLogout = () => {
    // 清除权限服务中的用户数据
    permissionService.logout();
    
    // 清除 localStorage 中的用户数据
    localStorage.removeItem('user');
    
    // 跳转到登录页面
    navigate('/login');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '0 16px',
      height: '64px',
      background: '#fff',
      borderBottom: '1px solid #e8e8e8',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>店铺管理系统</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserIcon style={{ marginRight: '8px' }} />
          <span>{user?.name || '用户'}</span>
        </div>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            color: '#666',
            padding: '8px',
            borderRadius: '4px'
          }}
          onClick={handleLogout}
          title="退出登录"
        >
          <LogoutIcon />
        </div>
      </div>
    </div>
  );
}