import { useState, useEffect } from 'react';
import { HealthCheckService, SystemHealth } from '../../services/healthCheck';

interface HealthStatus {
  status: string;
  message: string;
  responseTime?: number;
  lastCheck?: string;
}

interface ServiceHealth {
  storage: HealthStatus;
  network: HealthStatus;
  database: HealthStatus;
  authentication: HealthStatus;
  stores: HealthStatus;
  api: HealthStatus;
  cache: HealthStatus;
  backup: HealthStatus;
}

interface ExtendedSystemHealth {
  overall: HealthStatus;
  services: ServiceHealth;
  performance: {
    cpu: number;
    memory: number;
    disk: number;
    uptime: string;
  };
  timestamp: string;
}

// Helper functions - defined outside component for better scoping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return '#52c41a';
    case 'warning': return '#fa8c16';
    case 'error': return '#ff4d4f';
    default: return '#d9d9d9';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'healthy': return '正常';
    case 'warning': return '警告';
    case 'error': return '错误';
    default: return '未知';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    default: return '❓';
  }
};

const getPerformanceColor = (value: number) => {
  if (value < 50) return '#52c41a';
  if (value < 80) return '#fa8c16';
  return '#ff4d4f';
};

const getServiceName = (key: string) => {
  const serviceNames: { [key: string]: string } = {
    storage: '存储服务',
    network: '网络服务',
    database: '数据库服务',
    authentication: '认证服务',
    stores: '店铺服务',
    api: 'API服务',
    cache: '缓存服务',
    backup: '备份服务'
  };
  return serviceNames[key] || key;
};

export default function HealthCheckPage() {
  const [healthData, setHealthData] = useState<ExtendedSystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const healthCheckService = HealthCheckService.getInstance();

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setChecking(true);
      // 模拟健康检查数据
      const mockHealthData: ExtendedSystemHealth = {
        overall: {
          status: 'healthy',
          message: '系统运行正常，所有服务状态良好',
          responseTime: 45,
          lastCheck: new Date().toLocaleString()
        },
        services: {
          storage: {
            status: 'healthy',
            message: '存储服务正常运行，可用空间充足',
            responseTime: 12,
            lastCheck: new Date().toLocaleString()
          },
          network: {
            status: 'healthy',
            message: '网络连接稳定，延迟正常',
            responseTime: 8,
            lastCheck: new Date().toLocaleString()
          },
          database: {
            status: 'healthy',
            message: '数据库连接正常，查询性能良好',
            responseTime: 25,
            lastCheck: new Date().toLocaleString()
          },
          authentication: {
            status: 'healthy',
            message: '认证服务运行正常',
            responseTime: 18,
            lastCheck: new Date().toLocaleString()
          },
          stores: {
            status: 'warning',
            message: '店铺服务正常，但有一个分店连接较慢',
            responseTime: 120,
            lastCheck: new Date().toLocaleString()
          },
          api: {
            status: 'healthy',
            message: 'API服务响应正常',
            responseTime: 35,
            lastCheck: new Date().toLocaleString()
          },
          cache: {
            status: 'healthy',
            message: '缓存服务运行正常',
            responseTime: 5,
            lastCheck: new Date().toLocaleString()
          },
          backup: {
            status: 'healthy',
            message: '备份服务正常运行，最近备份成功',
            responseTime: 200,
            lastCheck: new Date().toLocaleString()
          }
        },
        performance: {
          cpu: 35.2,
          memory: 68.5,
          disk: 42.8,
          uptime: '15天 8小时'
        },
        timestamp: new Date().toISOString()
      };
      
      setHealthData(mockHealthData);
    } catch (error) {
      console.error('加载健康检查数据失败:', error);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ color: '#666', fontSize: '16px' }}>正在检查系统健康状态...</p>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div style={{ 
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <p style={{ color: '#666', fontSize: '16px' }}>无法获取健康检查数据</p>
        </div>
      </div>
    );
  }

  const serviceStats = {
    totalServices: Object.keys(healthData.services).length,
    healthyServices: Object.values(healthData.services).filter(s => s.status === 'healthy').length,
    warningServices: Object.values(healthData.services).filter(s => s.status === 'warning').length,
    errorServices: Object.values(healthData.services).filter(s => s.status === 'error').length,
    avgResponseTime: Math.round(Object.values(healthData.services).reduce((sum, s) => sum + (s.responseTime || 0), 0) / Object.keys(healthData.services).length)
  };

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 页面标题 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
              🏥 系统健康检查
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              监控系统运行状态和服务健康状况
            </p>
          </div>
          <button
            onClick={loadHealthData}
            disabled={checking}
            style={{
              backgroundColor: checking ? '#d9d9d9' : '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: checking ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!checking) {
                e.currentTarget.style.backgroundColor = '#40a9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!checking) {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }
            }}
          >
            {checking ? '⏳ 检查中...' : '🔄 重新检查'}
          </button>
        </div>
      </div>

      {/* 系统状态概览 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
              {getStatusIcon(healthData.overall.status)} 系统整体状态
            </h2>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              {healthData.overall.message}
            </p>
          </div>
          <div style={{ 
            padding: '12px 24px', 
            borderRadius: '20px', 
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: healthData.overall.status === 'healthy' ? '#f6ffed' : 
                             healthData.overall.status === 'warning' ? '#fff7e6' : '#fff2f0',
            color: getStatusColor(healthData.overall.status),
            border: `2px solid ${getStatusColor(healthData.overall.status)}`
          }}>
            {getStatusText(healthData.overall.status)}
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #1890ff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>服务总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {serviceStats.totalServices}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🔧</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #52c41a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>正常服务</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {serviceStats.healthyServices}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>✅</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #fa8c16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>警告服务</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {serviceStats.warningServices}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⚠️</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #ff4d4f'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>错误服务</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {serviceStats.errorServices}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>❌</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #722ed1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>平均响应时间</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {serviceStats.avgResponseTime}ms
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⚡</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #13c2c2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>系统运行时间</p>
              <p style={{ margin: '0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                {healthData.performance.uptime}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>⏱️</div>
          </div>
        </div>
      </div>

      {/* 服务状态详情 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
          🔧 服务状态详情
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {Object.entries(healthData.services).map(([key, service]) => (
            <div 
              key={key} 
              style={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #e8e8e8',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: '0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
                  {getStatusIcon(service.status)} {getServiceName(key)}
                </h4>
                <div style={{ 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: service.status === 'healthy' ? '#f6ffed' : 
                                   service.status === 'warning' ? '#fff7e6' : '#fff2f0',
                  color: getStatusColor(service.status)
                }}>
                  {getStatusText(service.status)}
                </div>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                {service.message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                <span>响应时间: {service.responseTime}ms</span>
                <span>检查时间: {service.lastCheck}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 系统性能 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
          📊 系统性能
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>CPU 使用率</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: getPerformanceColor(healthData.performance.cpu) }}>
                {healthData.performance.cpu}%
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${healthData.performance.cpu}%`, 
                height: '100%', 
                backgroundColor: getPerformanceColor(healthData.performance.cpu),
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>内存使用率</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: getPerformanceColor(healthData.performance.memory) }}>
                {healthData.performance.memory}%
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${healthData.performance.memory}%`, 
                height: '100%', 
                backgroundColor: getPerformanceColor(healthData.performance.memory),
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>磁盘使用率</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: getPerformanceColor(healthData.performance.disk) }}>
                {healthData.performance.disk}%
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${healthData.performance.disk}%`, 
                height: '100%', 
                backgroundColor: getPerformanceColor(healthData.performance.disk),
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 检查时间 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
              📅 检查时间
            </h3>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              最后健康检查时间: {new Date(healthData.timestamp).toLocaleString()}
            </p>
          </div>
          <div style={{ fontSize: '32px' }}>⏰</div>
        </div>
      </div>
    </div>
  );
}