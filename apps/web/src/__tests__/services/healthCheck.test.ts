import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthCheckService } from '../../services/healthCheck';

describe('HealthCheckService', () => {
  let healthCheckService: HealthCheckService;

  beforeEach(() => {
    healthCheckService = HealthCheckService.getInstance();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should get instance', () => {
    expect(healthCheckService).toBeDefined();
    const anotherInstance = HealthCheckService.getInstance();
    expect(anotherInstance).toBe(healthCheckService);
  });

  it('should check storage health', async () => {
    const storageHealth = await (healthCheckService as any).checkStorageHealth();
    
    expect(storageHealth).toBeDefined();
    expect(storageHealth.status).toBeDefined();
    expect(storageHealth.message).toBeDefined();
    expect(storageHealth.timestamp).toBeDefined();
  });

  it('should check network health', async () => {
    const networkHealth = await (healthCheckService as any).checkNetworkHealth();
    
    expect(networkHealth).toBeDefined();
    expect(networkHealth.status).toBeDefined();
    expect(networkHealth.message).toBeDefined();
    expect(networkHealth.timestamp).toBeDefined();
  });

  it('should check database health', async () => {
    const databaseHealth = await (healthCheckService as any).checkDatabaseHealth();
    
    expect(databaseHealth).toBeDefined();
    expect(databaseHealth.status).toBeDefined();
    expect(databaseHealth.message).toBeDefined();
    expect(databaseHealth.timestamp).toBeDefined();
  });

  it('should check authentication health with no user', async () => {
    const authHealth = await (healthCheckService as any).checkAuthenticationHealth();
    
    expect(authHealth).toBeDefined();
    expect(authHealth.status).toBe('warning');
    expect(authHealth.message).toBe('无活动用户会话');
    expect(authHealth.timestamp).toBeDefined();
  });

  it('should check authentication health with valid user', async () => {
    // 设置有效的用户数据
    const userData = { id: '1', name: 'Test User', role: 'admin' };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    const authHealth = await (healthCheckService as any).checkAuthenticationHealth();
    
    expect(authHealth).toBeDefined();
    expect(authHealth.status).toBe('healthy');
    expect(authHealth.message).toBe('认证服务正常');
    expect(authHealth.timestamp).toBeDefined();
  });

  it('should check authentication health with invalid user data', async () => {
    // 设置无效的用户数据
    localStorage.setItem('currentUser', 'invalid json');
    
    const authHealth = await (healthCheckService as any).checkAuthenticationHealth();
    
    expect(authHealth).toBeDefined();
    expect(authHealth.status).toBe('warning');
    expect(authHealth.message).toBe('用户会话数据格式异常');
    expect(authHealth.timestamp).toBeDefined();
  });

  it('should calculate overall health as healthy', () => {
    const services: any = {
      storage: { status: 'healthy' },
      network: { status: 'healthy' },
      database: { status: 'healthy' },
      authentication: { status: 'healthy' },
      stores: { status: 'healthy' }
    };

    const overall = (healthCheckService as any).calculateOverallHealth(services);
    
    expect(overall).toBeDefined();
    expect(overall.status).toBe('healthy');
    expect(overall.message).toBe('系统运行正常');
    expect(overall.timestamp).toBeDefined();
  });

  it('should calculate overall health as error', () => {
    const services: any = {
      storage: { status: 'healthy' },
      network: { status: 'error' },
      database: { status: 'healthy' },
      authentication: { status: 'healthy' },
      stores: { status: 'healthy' }
    };

    const overall = (healthCheckService as any).calculateOverallHealth(services);
    
    expect(overall).toBeDefined();
    expect(overall.status).toBe('error');
    expect(overall.message).toBe('系统存在严重问题');
    expect(overall.timestamp).toBeDefined();
  });

  it('should calculate overall health as warning', () => {
    const services: any = {
      storage: { status: 'healthy' },
      network: { status: 'warning' },
      database: { status: 'healthy' },
      authentication: { status: 'healthy' },
      stores: { status: 'healthy' }
    };

    const overall = (healthCheckService as any).calculateOverallHealth(services);
    
    expect(overall).toBeDefined();
    expect(overall.status).toBe('warning');
    expect(overall.message).toBe('系统存在警告');
    expect(overall.timestamp).toBeDefined();
  });

  it('should check system health', async () => {
    const systemHealth = await healthCheckService.checkSystemHealth();
    
    expect(systemHealth).toBeDefined();
    expect(systemHealth.overall).toBeDefined();
    expect(systemHealth.services).toBeDefined();
    expect(systemHealth.timestamp).toBeDefined();
    
    // 检查各个服务
    expect(systemHealth.services.storage).toBeDefined();
    expect(systemHealth.services.network).toBeDefined();
    expect(systemHealth.services.database).toBeDefined();
    expect(systemHealth.services.authentication).toBeDefined();
    expect(systemHealth.services.stores).toBeDefined();
  });

  it('should get quick health status', async () => {
    const quickHealth = await healthCheckService.getQuickHealthStatus();
    
    expect(quickHealth).toBeDefined();
    expect(quickHealth.status).toBeDefined();
    expect(quickHealth.message).toBeDefined();
    expect(quickHealth.timestamp).toBeDefined();
  });
});