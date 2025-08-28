import 'tdesign-react/dist/tdesign.css';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'tdesign-react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider globalConfig={{}}>
    <Suspense fallback={<div style={{padding: 16}}>页面加载中...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </ConfigProvider>
);