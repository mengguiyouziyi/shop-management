import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentStore } = useAppStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (currentStore && !isRedirecting) {
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