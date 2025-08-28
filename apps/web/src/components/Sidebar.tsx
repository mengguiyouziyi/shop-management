import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopIcon, UserIcon, CircleIcon, CodeIcon } from 'tdesign-icons-react';

const menuItems = [
  { key: '/', label: '首页', icon: <ShopIcon /> },
  { key: '/members', label: '会员管理', icon: <UserIcon /> },
  { key: '/products', label: '商品管理', icon: <CodeIcon /> },
  { key: '/orders/pos', label: 'POS 收银', icon: <CircleIcon /> },
  { key: '/finance/daily', label: '财务日报', icon: <CircleIcon /> }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div style={{ 
      width: 220, 
      height: '100%', 
      background: '#fff', 
      borderRight: '1px solid #e8e8e8',
      padding: '16px 0'
    }}>
      {menuItems.map((m) => (
        <div
          key={m.key}
          onClick={() => navigate(m.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            cursor: 'pointer',
            background: pathname === m.key ? '#e6f7ff' : 'transparent',
            color: pathname === m.key ? '#1890ff' : '#333',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            if (pathname !== m.key) {
              e.currentTarget.style.background = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== m.key) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span style={{ marginRight: '8px' }}>{m.icon}</span>
          <span>{m.label}</span>
        </div>
      ))}
    </div>
  );
}