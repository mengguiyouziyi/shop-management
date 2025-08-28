import React from 'react';
import { UserIcon, SettingIcon } from 'tdesign-icons-react';

export default function Header() {
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
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <UserIcon style={{ marginRight: '8px' }} />
        <span>管理员</span>
      </div>
    </div>
  );
}