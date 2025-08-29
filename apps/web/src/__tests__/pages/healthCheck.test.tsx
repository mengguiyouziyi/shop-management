import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import HealthCheckPage from '../../pages/health-check/index';

// Mock HealthCheckService
vi.mock('../../services/healthCheck', () => ({
  HealthCheckService: {
    getInstance: () => ({
      checkSystemHealth: vi.fn().mockResolvedValue({
        overall: {
          status: 'healthy',
          message: '系统运行正常',
          timestamp: new Date().toISOString()
        },
        services: {
          storage: {
            status: 'healthy',
            message: '存储服务正常',
            timestamp: new Date().toISOString()
          },
          network: {
            status: 'healthy',
            message: '网络连接正常',
            timestamp: new Date().toISOString()
          },
          database: {
            status: 'healthy',
            message: '数据库连接正常',
            timestamp: new Date().toISOString()
          },
          authentication: {
            status: 'healthy',
            message: '认证服务正常',
            timestamp: new Date().toISOString()
          },
          stores: {
            status: 'healthy',
            message: '店铺服务正常 (2 个店铺)',
            timestamp: new Date().toISOString()
          }
        },
        timestamp: new Date().toISOString()
      })
    })
  }
}));

describe('HealthCheckPage', () => {
  it('should render health check page', async () => {
    render(
      <MemoryRouter>
        <HealthCheckPage />
      </MemoryRouter>
    );

    // 等待异步加载完成
    await screen.findByText('系统健康检查');
    
    expect(screen.getByText('系统健康检查')).toBeInTheDocument();
    expect(screen.getByText('整体状态')).toBeInTheDocument();
    expect(screen.getByText('存储服务')).toBeInTheDocument();
    expect(screen.getByText('网络服务')).toBeInTheDocument();
    expect(screen.getByText('数据库服务')).toBeInTheDocument();
    expect(screen.getByText('认证服务')).toBeInTheDocument();
    expect(screen.getByText('店铺服务')).toBeInTheDocument();
  });

  it('should display healthy status', async () => {
    render(
      <MemoryRouter>
        <HealthCheckPage />
      </MemoryRouter>
    );

    // 等待异步加载完成
    await screen.findByText('正常');
    
    expect(screen.getByText('正常')).toBeInTheDocument();
    expect(screen.getByText('系统运行正常')).toBeInTheDocument();
  });

  it('should have refresh button', async () => {
    render(
      <MemoryRouter>
        <HealthCheckPage />
      </MemoryRouter>
    );

    // 等待异步加载完成
    await screen.findByText('重新检查');
    
    expect(screen.getByText('重新检查')).toBeInTheDocument();
  });
});