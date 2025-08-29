import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import ResourceSharingPage from '../../pages/resource-sharing/index';
import { useAppStore } from '../../store/useAppStore';
import { ResourceSharingService } from '../../services/resourceSharing';
import { StoreService } from '../../services/store';

// Mock dependencies
vi.mock('../../store/useAppStore');
vi.mock('../../services/resourceSharing');
vi.mock('../../services/store');

describe('ResourceSharingPage', () => {
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
      level: 1
    }
  ];

  const mockSharedResources = [
    {
      id: 'product_product1_store1',
      name: 'Test Product',
      type: 'product',
      sourceStoreId: 'store1',
      sourceStoreName: 'Test Store',
      sharedWith: [
        {
          storeId: 'store2',
          storeName: 'Test Store 2',
          sharedAt: '2023-01-01'
        }
      ],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    }
  ];

  const mockShareRequests = [
    {
      id: 'request1',
      resourceId: 'product1',
      resourceName: 'Test Product',
      resourceType: 'product',
      requestingStoreId: 'store2',
      requestingStoreName: 'Test Store 2',
      targetStoreId: 'store1',
      status: 'pending',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock useAppStore
    (useAppStore as jest.Mock).mockReturnValue({
      currentStore: mockCurrentStore,
      setCurrentStore: vi.fn()
    });
    
    // Mock ResourceSharingService
    const mockResourceSharingService = {
      getAllSharedResources: vi.fn().mockResolvedValue(mockSharedResources),
      getShareRequestsForStore: vi.fn().mockResolvedValue(mockShareRequests),
      shareResource: vi.fn().mockResolvedValue({}),
      createShareRequest: vi.fn().mockResolvedValue({}),
      processShareRequest: vi.fn().mockResolvedValue({}),
      stopSharingResource: vi.fn().mockResolvedValue({})
    };
    
    (ResourceSharingService.getInstance as jest.Mock).mockReturnValue(mockResourceSharingService);
    
    // Mock StoreService
    const mockStoreService = {
      getAllStores: vi.fn().mockResolvedValue(mockStores)
    };
    
    (StoreService.getInstance as jest.Mock).mockReturnValue(mockStoreService);
  });

  it('should render resource sharing page', async () => {
    render(
      <MemoryRouter>
        <ResourceSharingPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('资源共享管理')).toBeInTheDocument();
    });

    // Check tabs
    expect(screen.getByText('共享资源')).toBeInTheDocument();
    expect(screen.getByText('共享请求')).toBeInTheDocument();
  });

  it('should display shared resources', async () => {
    render(
      <MemoryRouter>
        <ResourceSharingPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Check shared resources table
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('商品')).toBeInTheDocument();
    expect(screen.getByText('Test Store')).toBeInTheDocument();
    expect(screen.getByText('Test Store 2')).toBeInTheDocument();
  });

  it('should display share requests', async () => {
    render(
      <MemoryRouter>
        <ResourceSharingPage />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Switch to requests tab
    const requestsTab = screen.getByText('共享请求');
    fireEvent.click(requestsTab);

    // Check share requests table
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('商品')).toBeInTheDocument();
    expect(screen.getByText('Test Store 2')).toBeInTheDocument();
    expect(screen.getByText('待处理')).toBeInTheDocument();
  });
});