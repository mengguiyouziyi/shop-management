import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentStore, stores, members, products, orders } = useAppStore();
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

  // 计算统计数据
  const totalStores = stores.length;
  const totalMembers = members.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const activeMembers = members.filter(m => m.isActive).length;
  const totalProductsValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

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
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏪</div>
            <h2 style={{ marginBottom: '16px', color: '#333', fontSize: '24px' }}>欢迎使用店铺管理系统</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '16px' }}>
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
      {/* 页面标题 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
              🏠 系统首页
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              当前店铺: {currentStore.name} | 系统总览
            </p>
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#1890ff',
            backgroundColor: '#e6f7ff',
            padding: '6px 12px', 
            borderRadius: '12px',
            fontWeight: 'bold'
          }}>
            正在跳转到销售报表...
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #1890ff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总店铺数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalStores}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🏪</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #52c41a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总会员数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalMembers}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>👥</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #722ed1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>商品总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalProducts}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📦</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #fa8c16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>订单总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalOrders}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>📋</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #13c2c2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>活跃会员</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {activeMembers}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⭐</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #eb2f96'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总销售额</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                ¥{totalSales.toFixed(2)}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>💰</div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          🚀 快速操作
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px'
        }}>
          <button
            onClick={() => navigate('/members')}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#40a9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
            }}
          >
            <span style={{ fontSize: '24px' }}>👥</span>
            <span>会员管理</span>
          </button>

          <button
            onClick={() => navigate('/products')}
            style={{
              backgroundColor: '#52c41a',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#73d13d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#52c41a';
            }}
          >
            <span style={{ fontSize: '24px' }}>📦</span>
            <span>商品管理</span>
          </button>

          <button
            onClick={() => navigate('/orders/pos')}
            style={{
              backgroundColor: '#722ed1',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#9254de';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#722ed1';
            }}
          >
            <span style={{ fontSize: '24px' }}>💰</span>
            <span>POS收银</span>
          </button>

          <button
            onClick={() => navigate('/reports/sales')}
            style={{
              backgroundColor: '#fa8c16',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffa940';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fa8c16';
            }}
          >
            <span style={{ fontSize: '24px' }}>📊</span>
            <span>销售报表</span>
          </button>
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