import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function DailyFinancePage() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { orders, products } = useAppStore();

  // Calculate daily statistics
  const getDailyStats = () => {
    const selectedDate = date.toISOString().split('T')[0];
    const dayOrders = orders.filter(order => 
      order.createdAt.split('T')[0] === selectedDate && 
      order.status === 'completed'
    );

    const totalOrders = dayOrders.length;
    const totalIncome = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalExpense = dayOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.productId);
        return itemSum + (product ? product.cost * item.quantity : 0);
      }, 0);
    }, 0);
    const balance = totalIncome - totalExpense;

    const orderDetails = dayOrders.map(order => ({
      orderNo: order.id,
      time: new Date(order.createdAt).toLocaleString('zh-CN'),
      amount: order.totalAmount || 0,
      paymentMethod: getPaymentMethodName(order.paymentMethod)
    }));

    return {
      totalOrders,
      totalIncome,
      totalExpense,
      balance,
      orders: orderDetails
    };
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cash': return '现金';
      case 'card': return '银行卡';
      case 'mobile': return '移动支付';
      case 'member_balance': return '会员余额';
      default: return '未知';
    }
  };

  const stats = getDailyStats();

  const exportCSV = () => {
    const csvContent = [
      '订单号,时间,金额,支付方式',
      ...stats.orders.map(o => 
        `${o.orderNo},${o.time},${o.amount},${o.paymentMethod}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `日结报表_${date.toISOString().split('T')[0]}.csv`;
    link.click();
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
              📊 财务日报
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              查看每日财务收支情况和订单明细
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>选择日期：</label>
              <input 
                type="date" 
                value={date.toISOString().split('T')[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                style={{ 
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#fff'
                }}
              />
            </div>
            <button
              onClick={exportCSV}
              disabled={stats.orders.length === 0}
              style={{
                backgroundColor: stats.orders.length === 0 ? '#d9d9d9' : '#52c41a',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: stats.orders.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (stats.orders.length > 0) {
                  e.currentTarget.style.backgroundColor = '#73d13d';
                }
              }}
              onMouseLeave={(e) => {
                if (stats.orders.length > 0) {
                  e.currentTarget.style.backgroundColor = '#52c41a';
                }
              }}
            >
              📥 导出报表
            </button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>订单数量</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {stats.totalOrders}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
                平均客单价: ¥{stats.totalOrders > 0 ? (stats.totalIncome / stats.totalOrders).toFixed(2) : '0.00'}
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
          borderTop: '4px solid #52c41a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总收入</p>
              <p style={{ margin: '0', color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}>
                ¥{stats.totalIncome.toFixed(2)}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
                营业收入
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>💰</div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #ff4d4f'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总成本</p>
              <p style={{ margin: '0', color: '#ff4d4f', fontSize: '28px', fontWeight: 'bold' }}>
                ¥{stats.totalExpense.toFixed(2)}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
                商品成本
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>💸</div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: `4px solid ${stats.balance >= 0 ? '#52c41a' : '#ff4d4f'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>净利润</p>
              <p style={{ 
                margin: '0', 
                color: stats.balance >= 0 ? '#52c41a' : '#ff4d4f', 
                fontSize: '28px', 
                fontWeight: 'bold' 
              }}>
                ¥{stats.balance.toFixed(2)}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '12px' }}>
                利润率: {stats.totalIncome > 0 ? ((stats.balance / stats.totalIncome) * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>
              {stats.balance >= 0 ? '📈' : '📉'}
            </div>
          </div>
        </div>
      </div>

      {/* 订单明细 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
            📋 订单明细
          </h2>
          <span style={{ 
            backgroundColor: '#f0f9ff',
            color: '#1890ff',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            共 {stats.orders.length} 笔订单
          </span>
        </div>
        
        {stats.orders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>暂无订单数据</p>
            <p style={{ fontSize: '14px' }}>选择的日期没有完成的订单</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '14px'
                  }}>订单号</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '14px'
                  }}>时间</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '14px'
                  }}>金额</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '14px'
                  }}>支付方式</th>
                </tr>
              </thead>
              <tbody>
                {stats.orders.map((order, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                  }}>
                    <td style={{ 
                      padding: '12px', 
                      color: '#666',
                      fontSize: '14px',
                      fontFamily: 'monospace'
                    }}>
                      {order.orderNo.substring(0, 8)}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      {order.time}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      color: '#52c41a',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      ¥{order.amount ? order.amount.toFixed(2) : '0.00'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        backgroundColor: getPaymentMethodColor(order.paymentMethod),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {order.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  function getPaymentMethodColor(method: string) {
    switch (method) {
      case '现金': return '#52c41a';
      case '银行卡': return '#1890ff';
      case '移动支付': return '#722ed1';
      case '会员余额': return '#fa8c16';
      default: return '#d9d9d9';
    }
  }
}