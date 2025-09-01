import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as React from 'react';
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
    id: 'settings1',
    headquartersId: 'hq1',
    syncProducts: true,
    syncMembers: true,
    syncSuppliers: false,
    syncPricing: true,
    syncInventory: false,
    allowCrossStoreOrders: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  const mockAllStores = [
    mockCurrentStore,
    ...mockBranches
  ];

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock returns
    (useAppStore as any).mockReturnValue({
      currentStore: mockCurrentStore
    });
    
    (HeadquartersBranchService.getInstance as any).mockReturnValue({
      getChildStores: vi.fn().mockResolvedValue(mockBranches),
      getHeadquartersBranchSettings: vi.fn().mockResolvedValue(mockSettings),
      updateHeadquartersBranchSettings: vi.fn().mockResolvedValue(mockSettings),
      syncDataToBranches: vi.fn().mockResolvedValue(undefined)
    });
    
    (StoreService.getInstance as any).mockReturnValue({
      getAllStores: vi.fn().mockResolvedValue(mockAllStores)
    });
  });

  it('should show loading state initially', () => {
    render(
      <MemoryRouter>
        <HeadquartersBranchPage />
      </MemoryRouter>
    );

    // Check loading state
    expect(screen.getByText('加载中...')).toBeTruthy();
  });
});