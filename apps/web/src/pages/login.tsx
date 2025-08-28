import { Button, Form, Input, Space } from 'tdesign-react';
import { LockOnIcon, UserIcon } from 'tdesign-icons-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">店铺管理系统</h2>
          <p className="mt-2 text-sm text-gray-600">县级商户专用</p>
        </div>
        <Form layout="vertical">
          <Form.FormItem label="用户名" name="username">
            <Input prefixIcon={<UserIcon />} placeholder="请输入用户名" />
          </Form.FormItem>
          <Form.FormItem label="密码" name="password">
            <Input 
              type="password" 
              prefixIcon={<LockOnIcon />} 
              placeholder="请输入密码" 
            />
          </Form.FormItem>
          <Space direction="vertical" className="w-full mt-6">
            <Button type="submit" block>
              登录
            </Button>
            <Button variant="text" block>
              忘记密码
            </Button>
          </Space>
        </Form>
      </div>
    </div>
  );
}