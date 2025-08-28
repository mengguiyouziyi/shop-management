import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'tdesign-react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);