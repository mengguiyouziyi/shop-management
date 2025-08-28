import React from 'react';
import { Button } from 'tdesign-react';

export default function LoginPrompt() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">请先登录</h2>
        <p className="text-gray-600 mb-6">您需要登录才能访问店铺管理系统</p>
        <Button type="primary" onClick={() => window.location.href = '/login'}>
          去登录
        </Button>
      </div>
    </div>
  );
}