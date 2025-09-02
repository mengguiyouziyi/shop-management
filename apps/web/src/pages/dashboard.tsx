import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const stats = {
    totalProducts: 156,
    totalMembers: 89,
    totalOrders: 342,
    totalSales: 45680.50,
    todayOrders: 28,
    todaySales: 3240.00,
    lowStock: 12,
    pendingOrders: 5
  };

  const quickActions = [
    {
      title: '商品管理',
      description: '添加、编辑和删除商品信息',
      icon: '📦',
      color: '#1890ff',
      path: '/products',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: '会员管理',
      description: '管理会员信息和积分',
      icon: '👥',
      color: '#52c41a',
      path: '/members',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'POS收银',
      description: '快速收银结账',
      icon: '💰',
      color: '#fa8c16',
      path: '/orders/pos',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: '销售报表',
      description: '查看销售数据分析',
      icon: '📊',
      color: '#722ed1',
      path: '/reports/sales',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      title: '库存管理',
      description: '管理商品库存和预警',
      icon: '📋',
      color: '#13c2c2',
      path: '/inventory',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      title: '采购管理',
      description: '管理采购订单和供应商',
      icon: '🚚',
      color: '#f5222d',
      path: '/purchase-orders',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ];

  const recentOrders = [
    { id: '001', customer: '张三', amount: 128.50, status: '已完成', time: '10:30' },
    { id: '002', customer: '李四', amount: 89.00, status: '处理中', time: '10:15' },
    { id: '003', customer: '王五', amount: 256.80, status: '已完成', time: '09:45' },
    { id: '004', customer: '赵六', amount: 67.20, status: '待处理', time: '09:30' }
  ];

  const topProducts = [
    { name: '苹果iPhone 15', sales: 45, revenue: 44955 },
    { name: '小米手机', sales: 32, revenue: 47968 },
    { name: '华为平板', sales: 28, revenue: 27972 },
    { name: 'AirPods', sales: 56, revenue: 16744 }
  ];

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>店铺管理系统</h2>
          <p>正在加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#f5f7fa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 头部欢迎区域 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 20px',
        marginBottom: '30px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '300' }}>
            欢迎使用店铺管理系统
          </h1>
          <p style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>
            实时掌握店铺运营状况，高效管理业务流程
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* 统计卡片 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(24,144,255,0.1) 0%, rgba(24,144,255,0.05) 100%)',
              borderRadius: '0 0 0 100px'
            }}></div>
            <div style={{ position: 'relative', zIndex: '1' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginRight: '16px'
                }}>📦</div>
                <div>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>商品总数</p>
                  <p style={{ margin: '0', color: '#333', fontSize: '32px', fontWeight: 'bold' }}>
                    {stats.totalProducts}
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#52c41a' }}>
                ↑ 12% 较上月
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(82,196,26,0.1) 0%, rgba(82,196,26,0.05) 100%)',
              borderRadius: '0 0 0 100px'
            }}></div>
            <div style={{ position: 'relative', zIndex: '1' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginRight: '16px'
                }}>👥</div>
                <div>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>会员总数</p>
                  <p style={{ margin: '0', color: '#333', fontSize: '32px', fontWeight: 'bold' }}>
                    {stats.totalMembers}
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#52c41a' }}>
                ↑ 8% 较上月
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(250,140,22,0.1) 0%, rgba(250,140,22,0.05) 100%)',
              borderRadius: '0 0 0 100px'
            }}></div>
            <div style={{ position: 'relative', zIndex: '1' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginRight: '16px'
                }}>💰</div>
                <div>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>今日销售</p>
                  <p style={{ margin: '0', color: '#333', fontSize: '32px', fontWeight: 'bold' }}>
                    ¥{stats.todaySales.toFixed(2)}
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#52c41a' }}>
                ↑ 15% 较昨日
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(114,46,209,0.1) 0%, rgba(114,46,209,0.05) 100%)',
              borderRadius: '0 0 0 100px'
            }}></div>
            <div style={{ position: 'relative', zIndex: '1' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginRight: '16px'
                }}>📊</div>
                <div>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>今日订单</p>
                  <p style={{ margin: '0', color: '#333', fontSize: '32px', fontWeight: 'bold' }}>
                    {stats.todayOrders}
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#52c41a' }}>
                ↑ 22% 较昨日
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '24px', fontWeight: '500' }}>
            快速操作
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px'
          }}>
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleQuickAction(action.path)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: action.gradient
                }}></div>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                  {action.icon}
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                  {action.title}
                </h3>
                <p style={{ margin: '0', fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 数据概览 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* 最近订单 */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '500' }}>
              最近订单
            </h3>
            <div style={{ spaceY: '12px' }}>
              {recentOrders.map((order, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < recentOrders.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#333' }}>{order.customer}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{order.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '500', color: '#333' }}>¥{order.amount}</div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: order.status === '已完成' ? '#52c41a' : 
                             order.status === '处理中' ? '#fa8c16' : '#f5222d'
                    }}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 热销商品 */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px', fontWeight: '500' }}>
              热销商品
            </h3>
            <div style={{ spaceY: '12px' }}>
              {topProducts.map((product, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < topProducts.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#333' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>销量: {product.sales}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '500', color: '#333' }}>¥{product.revenue.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: '#52c41a' }}>↑ {Math.round(product.revenue/product.sales)}元/件</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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