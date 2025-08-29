import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import DashboardPage from '../../pages/dashboard';
import { useAppStore } from '../../store/useAppStore';
import { StoreService } from '../../services/store';
import { CrossStoreReportingService } from '../../services/crossStoreReporting';
import { ResourceSharingService } from '../../services/resourceSharing';
import { HeadquartersBranchService } from '../../services/headquartersBranch';

// Mock dependencies
vi.mock('../../store/useAppStore');
vi.mock('../../services/store');
vi.mock('../../services/crossStoreReporting');
vi.mock('../../services/resourceSharing');
vi.mock('../../services/headquartersBranch');

describe('DashboardPage', () => {
  const mockCurrentStore = {
    id: 'store1',
    name: 'Test Store',
    code: 'TS001',
    address: 'Test Address',
    phone: '123456789',
    manager: 'Test Manager',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    isActive: true,
    level: 0
  };

  const mockStores = [
    mockCurrentStore,
    {
      id: 'store2',
      name: 'Test Store 2',
      code: 'TS002',
      address: 'Test Address 2',
      phone: '987654321',
      manager: 'Test Manager 2',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      isActive: true,
      level: 1,
      parentId: 'store1'
    }
  ];

  const mockAggregatedReport = {
    totalSales: 10000,
    totalOrders: 500,
    storeSales: [
      { storeId: 'store1', storeName: 'Test Store', sales: 7000, orderCount: 300 },
      { storeId: 'store2', storeName: 'Test Store 2', sales: 3000, orderCount: 200 }
    ]
  };

  const mockSharedResources = [
    {
      id: 'resource1',
      name: 'Test Product',
      type: 'product',
      sourceStoreId: 'store1',
      sourceStoreName: 'Test Store',
      sharedWith: [{ storeId: 'store2', storeName: 'Test Store 2', sharedAt: '2023-01-01' }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock useAppStore
    (useAppStore as any).mockReturnValue({
      currentStore: mockCurrentStore,
      setCurrentStore: vi.fn()
    });
    
    // Mock StoreService
    const mockStoreService = {
      getAllStores: vi.fn().mockResolvedValue(mockStores)
    };
    
    (StoreService.getInstance as any).mockReturnValue(mockStoreService);
    
    // Mock CrossStoreReportingService
    const mockCrossStoreReportingService = {
      getAggregatedSalesReport: vi.fn().mockResolvedValue(mockAggregatedReport)
    };
    
    (CrossStoreReportingService.getInstance as any).mockReturnValue(mockCrossStoreReportingService);
    
    // Mock ResourceSharingService
    const mockResourceSharingService = {
      getAllSharedResources: vi.fn().mockResolvedValue(mockSharedResources)
    };
    
    (ResourceSharingService.getInstance as any).mockReturnValue(mockResourceSharingService);
    
    // Mock HeadquartersBranchService
    const mockHeadquartersBranchService = {
      getChildStores: vi.fn().mockResolvedValue([mockStores[1]])
    };
    
    (HeadquartersBranchService.getInstance as any).mockReturnValue(mockHeadquartersBranchService);
  });

  it('should render dashboard page', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('多店铺管理仪表板')).toBeInTheDocument();
    });

    // Check tabs
    expect(screen.getByText('系统概览')).toBeInTheDocument();
    expect(screen.getByText('店铺管理')).toBeInTheDocument();
    expect(screen.getByText('报表分析')).toBeInTheDocument();
    expect(screen.getByText('资源共享')).toBeInTheDocument();
  });

  it('should display statistics', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // 店铺总数
    });

    // Check statistics
    expect(screen.getByText('10000.00')).toBeInTheDocument(); // 总销售额
    expect(screen.getByText('1')).toBeInTheDocument(); // 共享资源
    expect(screen.getByText('1')).toBeInTheDocument(); // 分店数量
  });

  it('should display system status', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('系统状态')).toBeInTheDocument();
    });

    // Check system status
    expect(screen.getByText('系统版本:')).toBeInTheDocument();
    expect(screen.getByText('数据库状态:')).toBeInTheDocument();
  });
});