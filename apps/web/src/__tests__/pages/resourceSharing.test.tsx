import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import ResourceSharingPage from '../../pages/resource-sharing/index';

// Mock data
const mockSharedResources = [
  {
    id: '1',
    name: 'Test Product',
    type: 'product',
    sourceStoreId: '1',
    sourceStoreName: 'Headquarters',
    sharedWith: [
      {
        storeId: '2',
        storeName: 'Test Store 2',
        sharedAt: '2023-01-01T00:00:00Z'
      }
    ],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

const mockShareRequests = [
  {
    id: '1',
    resourceId: '1',
    resourceName: 'Test Product',
    resourceType: 'product',
    requestingStoreId: '2',
    requestingStoreName: 'Test Store 2',
    targetStoreId: '1',
    status: 'pending',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

const mockStores = [
  {
    id: '1',
    name: 'Headquarters',
    code: 'HQ',
    address: '123 Main St',
    phone: '555-1234',
    manager: 'John Doe',
    level: 0,
    parentId: null,
    isHeadquarters: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Test Store 2',
    code: 'TS2',
    address: '456 Oak Ave',
    phone: '555-5678',
    manager: 'Jane Smith',
    level: 1,
    parentId: '1',
    isHeadquarters: false,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  }
];

// Mock services
vi.mock('../../services/resourceSharing', () => {
  return {
    ResourceSharingService: {
      getInstance: () => ({
        getSharedResources: vi.fn().mockResolvedValue(mockSharedResources),
        getShareRequests: vi.fn().mockResolvedValue(mockShareRequests),
        shareResource: vi.fn().mockResolvedValue({ success: true }),
        approveRequest: vi.fn().mockResolvedValue({ success: true }),
        rejectRequest: vi.fn().mockResolvedValue({ success: true })
      })
    }
  };
});

vi.mock('../../services/store', () => {
  return {
    StoreService: {
      getInstance: () => ({
        getAllStores: vi.fn().mockResolvedValue(mockStores)
      })
    }
  };
});

vi.mock('../../store/useAppStore', () => {
  return {
    useAppStore: () => ({
      currentStore: mockStores[0]
    })
  };
});

describe('ResourceSharingPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should render resource sharing page', () => {
    render(
      <MemoryRouter>
        <ResourceSharingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('资源共享')).toBeInTheDocument();
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
    }, { timeout: 3000 });

    expect(screen.getByText('product')).toBeInTheDocument();
    expect(screen.getByText('Test Store 2')).toBeInTheDocument();
  });

  it('should display share requests', async () => {
    render(
      <MemoryRouter>
        <ResourceSharingPage />
      </MemoryRouter>
    );

    // Switch to requests tab
    const requestsTab = screen.getByText('收到的共享请求');
    fireEvent.click(requestsTab);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check share requests table
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('product')).toBeInTheDocument();
    expect(screen.getByText('Test Store 2')).toBeInTheDocument();
  });

  it('should switch between tabs', () => {
    render(
      <MemoryRouter>
        <ResourceSharingPage />
      </MemoryRouter>
    );

    // Initially should show shared resources
    expect(screen.getByText('我共享的资源')).toBeInTheDocument();

    // Switch to requests tab
    const requestsTab = screen.getByText('收到的共享请求');
    fireEvent.click(requestsTab);
    expect(screen.getByText('收到的共享请求')).toBeInTheDocument();

    // Switch back to shared resources tab
    const sharedTab = screen.getByText('我共享的资源');
    fireEvent.click(sharedTab);
    expect(screen.getByText('我共享的资源')).toBeInTheDocument();
  });

  it('should open share resource form', () => {
    render(
      <MemoryRouter>
        <ResourceSharingPage />
      </MemoryRouter>
    );

    const shareButton = screen.getByText('发起资源共享');
    fireEvent.click(shareButton);
    
    expect(screen.getByText('发起资源共享')).toBeInTheDocument();
  });
});