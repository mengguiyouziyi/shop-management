import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function DailyFinancePage() {
  const [date, setDate] = useState(new Date());
  const { orders, products } = useAppStore();

  // Calculate daily statistics
  const getDailyStats = () => {
    const selectedDate = date.toISOString().split('T')[0];
    const dayOrders = orders.filter(order => 
      order.createdAt.split('T')[0] === selectedDate && 
      order.status === 'completed'
    );

    const totalOrders = dayOrders.length;
    const totalIncome = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
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
      amount: order.totalAmount,
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
    <div>
      <h2>财务日报</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>选择日期：</label>
        <input 
          type="date" 
          value={date.toISOString().split('T')[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          style={{ 
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>订单数</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
            {stats.totalOrders}
          </div>
        </div>
        
        <div style={{ 
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>收入</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
            ¥{stats.totalIncome.toFixed(2)}
          </div>
        </div>
        
        <div style={{ 
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>成本</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
            ¥{stats.totalExpense.toFixed(2)}
          </div>
        </div>
        
        <div style={{ 
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>利润</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: stats.balance >= 0 ? '#52c41a' : '#ff4d4f' }}>
            ¥{stats.balance.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>订单明细</h3>
        {stats.orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>暂无订单数据</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>订单号</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>时间</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>金额</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>支付方式</th>
                </tr>
              </thead>
              <tbody>
                {stats.orders.map((order, index) => (
                  <tr key={index}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.orderNo}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.time}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>¥{order.amount.toFixed(2)}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <button 
          onClick={exportCSV}
          style={{ 
            background: '#1890ff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          导出CSV
        </button>
      </div>
    </div>
  );
}
