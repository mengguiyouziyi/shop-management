import React, { useState, useEffect } from 'react';
import { Card, Message, Tag, Button, Space, Spin } from 'tdesign-react';
import { HealthCheckService, SystemHealth } from '../../services/healthCheck';

export default function HealthCheckPage() {
  const [healthData, setHealthData] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const healthCheckService = HealthCheckService.getInstance();

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const health = await healthCheckService.checkSystemHealth();
      setHealthData(health);
    } catch (error) {
      Message.error('加载健康检查数据失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTheme = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return '正常';
      case 'warning': return '警告';
      case 'error': return '错误';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '10px' }}>正在检查系统健康状态...</p>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>无法获取健康检查数据</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
          系统健康检查
        </h1>
        <Button theme="primary" onClick={loadHealthData}>
          重新检查
        </Button>
      </div>

      <Card style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px'
        }}>
          <div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>整体状态</h2>
            <p style={{ margin: '0', color: '#666' }}>
              {healthData.overall.message}
            </p>
          </div>
          <Tag 
            theme={getStatusTheme(healthData.overall.status)} 
            size="large"
            style={{ fontSize: '16px', padding: '10px 20px' }}
          >
            {getStatusText(healthData.overall.status)}
          </Tag>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>存储服务</h3>
            <Tag theme={getStatusTheme(healthData.services.storage.status)}>
              {getStatusText(healthData.services.storage.status)}
            </Tag>
          </div>
          <p style={{ margin: '0', color: '#666' }}>{healthData.services.storage.message}</p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>网络服务</h3>
            <Tag theme={getStatusTheme(healthData.services.network.status)}>
              {getStatusText(healthData.services.network.status)}
            </Tag>
          </div>
          <p style={{ margin: '0', color: '#666' }}>{healthData.services.network.message}</p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>数据库服务</h3>
            <Tag theme={getStatusTheme(healthData.services.database.status)}>
              {getStatusText(healthData.services.database.status)}
            </Tag>
          </div>
          <p style={{ margin: '0', color: '#666' }}>{healthData.services.database.message}</p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>认证服务</h3>
            <Tag theme={getStatusTheme(healthData.services.authentication.status)}>
              {getStatusText(healthData.services.authentication.status)}
            </Tag>
          </div>
          <p style={{ margin: '0', color: '#666' }}>{healthData.services.authentication.message}</p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>店铺服务</h3>
            <Tag theme={getStatusTheme(healthData.services.stores.status)}>
              {getStatusText(healthData.services.stores.status)}
            </Tag>
          </div>
          <p style={{ margin: '0', color: '#666' }}>{healthData.services.stores.message}</p>
        </Card>
      </div>

      <Card style={{ marginTop: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>检查时间</h3>
        <p style={{ margin: '0', color: '#666' }}>
          {new Date(healthData.timestamp).toLocaleString()}
        </p>
      </Card>
    </div>
  );
}