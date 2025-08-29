import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useAppStore } from './store/useAppStore';
import { SyncService } from './services/sync';

// 初始化存储
useAppStore.getState().initializeStore();

// 启动数据同步服务
const syncService = SyncService.getInstance();
syncService.startAutoSync(60000); // 每分钟同步一次

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);