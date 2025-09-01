import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PermissionService } from '../services/permission';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentStore } = useAppStore();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasAdminRole, setHasAdminRole] = useState(false);

  useEffect(() => {
    // 检查用户角色
    const permissionService = PermissionService.getInstance();
    const isAdmin = permissionService.hasRole('admin');
    
    setHasAdminRole(isAdmin);
    
    if (currentStore && isAdmin && !isRedirecting) {
      setIsRedirecting(true);
      // 延迟跳转，避免渲染问题
      const timer = setTimeout(() => {
        navigate('/reports/sales');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStore, navigate, isRedirecting]);

  if (!currentStore) {
    return (
      <div style={{ 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '16px', color: '#333' }}>欢迎使用店铺管理系统</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              系统正在初始化，请稍候...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAdminRole) {
    const handleLoginAsAdmin = () => {
      const permissionService = PermissionService.getInstance();
      const adminUser = {
        role: 'admin' as const,
        permissions: []
      };
      permissionService.setCurrentUser(adminUser);
      
      const authUser = {
        id: 'user_admin',
        name: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        permissions: []
      };
      localStorage.setItem('user', JSON.stringify(authUser));
      
      // 刷新页面
      window.location.reload();
    };

    return (
      <div style={{ 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '16px', color: '#333' }}>店铺管理系统</h2>
            <p style={{ color: '#666', marginBottom: '16px' }}>当前店铺: {currentStore.name}</p>
            <p style={{ color: '#ff4d4f', marginBottom: '20px' }}>您没有管理员权限，无法访问销售报表</p>
            <p style={{ color: '#666', marginBottom: '20px' }}>请联系管理员获取相应权限</p>
            <button 
              onClick={handleLoginAsAdmin}
              style={{
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              临时登录为管理员
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px', color: '#333' }}>店铺管理系统</h2>
          <p style={{ color: '#666', marginBottom: '16px' }}>当前店铺: {currentStore.name}</p>
          <p style={{ color: '#666', marginBottom: '20px' }}>正在跳转到销售报表...</p>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1890ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}