import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { StorageService } from '../../services/storage';

interface DataStats {
  products: number;
  members: number;
  orders: number;
  totalRevenue: number;
  lowStockProducts: number;
  activeMembers: number;
  completedOrders: number;
  dataLastBackup?: string;
}

export default function DataExportPage() {
  const { products, members, orders } = useAppStore();
  const storageService = StorageService.getInstance();
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [stats, setStats] = useState<DataStats>({
    products: 0,
    members: 0,
    orders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    activeMembers: 0,
    completedOrders: 0
  });

  useEffect(() => {
    calculateStats();
  }, [products, members, orders]);

  const calculateStats = () => {
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const lowStockProducts = products.filter(product => product.stock <= product.minStock).length;
    const activeMembers = members.filter(member => member.balance > 0 || member.points > 0).length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;

    setStats({
      products: products.length,
      members: members.length,
      orders: orders.length,
      totalRevenue,
      lowStockProducts,
      activeMembers,
      completedOrders,
      dataLastBackup: new Date().toLocaleDateString()
    });
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const data = {
        products,
        members,
        orders,
        stats,
        exportTime: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `shop-data-export-${new Date().toISOString().slice(0, 10)}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      // 模拟导出成功提示
      setTimeout(() => {
        alert('数据导出成功！');
      }, 500);
    } catch (error) {
      alert('数据导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const exportCSV = (type: 'products' | 'members' | 'orders') => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'products':
        csvContent = [
          '商品ID,商品名称,分类,价格,成本,库存,最低库存,状态',
          ...products.map(p => 
            `${p.id},${p.name},${p.category},${p.price},${p.cost},${p.stock},${p.minStock},${p.stock <= p.minStock ? '库存不足' : '正常'}`
          )
        ].join('\n');
        filename = `products-export-${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      
      case 'members':
        csvContent = [
          '会员ID,姓名,手机号,等级,余额,积分,注册时间',
          ...members.map(m => 
            `${m.id},${m.name},${m.phone},${m.level},${m.balance},${m.points},${new Date(m.createdAt).toLocaleDateString()}`
          )
        ].join('\n');
        filename = `members-export-${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      
      case 'orders':
        csvContent = [
          '订单ID,会员ID,总金额,支付方式,状态,创建时间',
          ...orders.map(o => 
            `${o.id},${o.memberId || '散客'},${o.totalAmount},${o.paymentMethod},${o.status},${new Date(o.createdAt).toLocaleString()}`
          )
        ].join('\n');
        filename = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  };

  const clearData = async () => {
    if (window.confirm('确定要清空所有数据吗？此操作不可恢复，请谨慎操作。')) {
      if (window.confirm('请再次确认：这将删除所有商品、会员和订单数据！')) {
        setClearing(true);
        try {
          storageService.clear();
          alert('数据已清空，页面将重新加载');
          window.location.reload();
        } catch (error) {
          alert('数据清理失败，请重试');
        } finally {
          setClearing(false);
        }
      }
    }
  };

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
              💾 数据管理
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              管理和导出系统数据，查看数据统计信息
            </p>
          </div>
          <div style={{ fontSize: '32px' }}>🗄️</div>
        </div>
      </div>

      {/* 数据统计卡片 */}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>商品总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.products}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
                低库存: {stats.lowStockProducts}
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
          borderTop: '4px solid #52c41a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>会员总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.members}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
                活跃会员: {stats.activeMembers}
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>订单总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.orders}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
                已完成: {stats.completedOrders}
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
          borderTop: '4px solid #fa8c16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总收入</p>
              <p style={{ margin: '0', color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}>
                ¥{stats.totalRevenue.toFixed(2)}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
                营业收入
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>💰</div>
          </div>
        </div>
      </div>

      {/* 数据导出 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          📤 数据导出
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '24px', marginRight: '12px' }}>📦</div>
              <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>商品数据</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
              导出所有商品信息，包括库存和价格数据
            </p>
            <button
              onClick={() => exportCSV('products')}
              style={{
                width: '100%',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#40a9ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }}
            >
              导出CSV
            </button>
          </div>

          <div style={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '24px', marginRight: '12px' }}>👥</div>
              <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>会员数据</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
              导出所有会员信息，包括余额和积分数据
            </p>
            <button
              onClick={() => exportCSV('members')}
              style={{
                width: '100%',
                backgroundColor: '#52c41a',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#73d13d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#52c41a';
              }}
            >
              导出CSV
            </button>
          </div>

          <div style={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '24px', marginRight: '12px' }}>📋</div>
              <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>订单数据</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
              导出所有订单信息，包括销售和支付数据
            </p>
            <button
              onClick={() => exportCSV('orders')}
              style={{
                width: '100%',
                backgroundColor: '#722ed1',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#9254de';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#722ed1';
              }}
            >
              导出CSV
            </button>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#f0f9ff',
          border: '1px solid #91d5ff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '20px', marginRight: '8px' }}>💾</div>
            <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>完整数据备份</h3>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
            导出所有数据为JSON格式，包含完整的系统数据结构和统计信息
          </p>
          <button
            onClick={exportData}
            disabled={exporting}
            style={{
              backgroundColor: exporting ? '#d9d9d9' : '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!exporting) {
                e.currentTarget.style.backgroundColor = '#40a9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!exporting) {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }
            }}
          >
            {exporting ? '⏳ 导出中...' : '📥 导出完整数据'}
          </button>
        </div>
      </div>

      {/* 数据清理 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
              🗑️ 数据清理
            </h2>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              清空所有本地存储的数据，此操作不可恢复
            </p>
          </div>
          <div style={{ fontSize: '32px' }}>⚠️</div>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '20px', marginRight: '8px' }}>⚠️</div>
            <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#ff4d4f' }}>
              危险操作
            </h3>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
            此操作将永久删除所有数据，包括：<br/>
            • 所有商品信息<br/>
            • 所有会员数据<br/>
            • 所有订单记录<br/>
            • 系统设置和配置
          </p>
          <button
            onClick={clearData}
            disabled={clearing}
            style={{
              backgroundColor: clearing ? '#d9d9d9' : '#ff4d4f',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: clearing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!clearing) {
                e.currentTarget.style.backgroundColor = '#ff7875';
              }
            }}
            onMouseLeave={(e) => {
              if (!clearing) {
                e.currentTarget.style.backgroundColor = '#ff4d4f';
              }
            }}
          >
            {clearing ? '⏳ 清理中...' : '🗑️ 清空所有数据'}
          </button>
        </div>

        {/* 数据备份信息 */}
        <div style={{ 
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '20px', marginRight: '8px' }}>💡</div>
            <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
              建议操作
            </h3>
          </div>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            在执行数据清理前，建议先导出数据备份。数据备份可以帮助您：<br/>
            • 恢复误删的数据<br/>
            • 迁移数据到新系统<br/>
            • 进行数据分析和报表生成
          </p>
        </div>
      </div>
    </div>
  );
}