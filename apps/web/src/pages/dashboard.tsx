import { Card, Space } from 'tdesign-react';

export default function DashboardPage() {
  return (
    <div className="p-4">
      <Space direction="vertical" size="large">
        <Card title="欢迎使用店铺管理系统" bordered>
          <p>请从左侧导航栏选择功能模块</p>
        </Card>
      </Space>
    </div>
  );
}