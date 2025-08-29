import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import HeadquartersBranchPage from '../../pages/headquarters-branch/index';
import { useAppStore } from '../../store/useAppStore';
import { HeadquartersBranchService } from '../../services/headquartersBranch';
import { StoreService } from '../../services/store';

// Mock dependencies
vi.mock('../../store/useAppStore');
vi.mock('../../services/headquartersBranch');
vi.mock('../../services/store');

describe('HeadquartersBranchPage', () => {
  const mockCurrentStore = {
    id: 'hq1',
    name: 'Test Headquarters',
    code: 'HQ001',
    address: 'Test Address',
    phone: '123456789',
    manager: 'Test Manager',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    isActive: true,
    level: 0
  };

  const mockBranches = [
    {
      id: 'branch1',
      name: 'Test Branch 1',
      code: 'B001',
      address: 'Branch Address 1',
      phone: '111111111',
      manager: 'Branch Manager 1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      isActive: true,
      level: 1,
      parentId: 'hq1'
    },
    {
      id: 'branch2',
      name: 'Test Branch 2',
      code: 'B002',
      address: 'Branch Address 2',
      phone: '222222222',
      manager: 'Branch Manager 2',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      isActive: true,
      level: 1,
      parentId: 'hq1'
    }
  ];

  const mockSettings = {
    id: 'settings_hq1',
    headquartersId: 'hq1',
    syncProducts: true,
    syncMembers: false,
    syncSuppliers: true,
    syncPricing: true,
    syncInventory: false,
    allowCrossStoreOrders: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock useAppStore
    (useAppStore as jest.Mock).mockReturnValue({
      currentStore: mockCurrentStore,
      setCurrentStore: vi.fn()
    });
    
    // Mock HeadquartersBranchService
    const mockHeadquartersBranchService = {
      getChildStores: vi.fn().mockResolvedValue(mockBranches),
      getHeadquartersBranchSettings: vi.fn().mockResolvedValue(mockSettings),
      updateHeadquartersBranchSettings: vi.fn().mockResolvedValue(mockSettings),
      syncProductsToBranches: vi.fn().mockResolvedValue(undefined),
      syncMembersToBranches: vi.fn().mockResolvedValue(undefined),
      syncSuppliersToBranches: vi.fn().mockResolvedValue(undefined)
    };
    
    (HeadquartersBranchService.getInstance as jest.Mock).mockReturnValue(mockHeadquartersBranchService);
    
    // Mock StoreService
    const mockStoreService = {
      getAllStores: vi.fn().mockResolvedValue([mockCurrentStore, ...mockBranches])
    };
    
    (StoreService.getInstance as jest.Mock).mockReturnValue(mockStoreService);
  });

  it('should render headquarters branch page', async () => {
    render(
      <MemoryRouter>
        <HeadquartersBranchPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('总部管理')).toBeInTheDocument();
    });

    // Check tabs
    expect(screen.getByText('管理设置')).toBeInTheDocument();
    expect(screen.getByText('分店管理')).toBeInTheDocument();
  });

  it('should display headquarters information', async () => {
    render(
      <MemoryRouter>
        <HeadquartersBranchPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('总部信息')).toBeInTheDocument();
    });

    // Check headquarters info
    expect(screen.getByText('Test Headquarters')).toBeInTheDocument();
    expect(screen.getByText('HQ001')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
  });

  it('should display branch information', async () => {
    render(
      <MemoryRouter>
        <HeadquartersBranchPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('总部管理')).toBeInTheDocument();
    });

    // Switch to branches tab
    const branchesTab = screen.getByText('分店管理');
    branchesTab.click();

    // Check branches table
    expect(screen.getByText('Test Branch 1')).toBeInTheDocument();
    expect(screen.getByText('Test Branch 2')).toBeInTheDocument();
    expect(screen.getByText('B001')).toBeInTheDocument();
    expect(screen.getByText('B002')).toBeInTheDocument();
  });

  it('should display settings', async () => {
    render(
      <MemoryRouter>
        <HeadquartersBranchPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('总部-分店管理设置')).toBeInTheDocument();
    });

    // Check settings
    expect(screen.getByText('同步产品数据')).toBeInTheDocument();
    expect(screen.getByText('同步会员数据')).toBeInTheDocument();
    expect(screen.getByText('同步供应商数据')).toBeInTheDocument();
  });
});