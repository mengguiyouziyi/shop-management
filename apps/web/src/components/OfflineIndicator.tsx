import React from 'react';
import { useNetworkStore } from '../services/network';

export default function OfflineIndicator() {
  const { isOnline } = useNetworkStore();

  if (isOnline) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ff4d4f',
      color: 'white',
      textAlign: 'center',
      padding: '8px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>您当前处于离线状态</span>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>数据将自动同步</span>
      </div>
    </div>
  );
}