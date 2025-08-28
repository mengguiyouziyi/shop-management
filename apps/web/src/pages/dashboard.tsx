import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h2>店铺管理面板</h2>
      
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
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>今日订单</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
            128
          </div>
        </div>
        
        <div style={{ 
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>新客户</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
            24
          </div>
        </div>
        
        <div style={{ 
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>销售额</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
            ¥8,560
          </div>
        </div>
        
        <div style={{ 
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>待处理</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
            5
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>系统状态</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <p><strong>系统版本:</strong> v1.0.0</p>
            <p><strong>运行时间:</strong> 7天 12小时</p>
            <p><strong>内存使用:</strong> 45%</p>
          </div>
          <div style={{ flex: 1 }}>
            <p><strong>数据库状态:</strong> 正常</p>
            <p><strong>备份状态:</strong> 已完成</p>
            <p><strong>安全状态:</strong> 正常</p>
          </div>
        </div>
      </div>
    </div>
  );
}