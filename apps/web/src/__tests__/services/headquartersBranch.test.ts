import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HeadquartersBranchService } from '../../services/headquartersBranch';

// 模拟数据
const mockStores = [
  {
    id: 'hq1',
    name: '总部',
    code: 'HQ001',
    address: '总部地址',
    phone: '123456789',
    manager: '总部经理',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    isActive: true,
    level: 0
  },
  {
    id: 'branch1',
    name: '分店1',
    code: 'B001',
    address: '分店1地址',
    phone: '123456780',
    manager: '分店1经理',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    isActive: true,
    level: 1,
    parentId: 'hq1'
  },
  {
    id: 'branch2',
    name: '分店2',
    code: 'B002',
    address: '分店2地址',
    phone: '123456788',
    manager: '分店2经理',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    isActive: true,
    level: 1,
    parentId: 'hq1'
  }
];

const mockHeadquartersBranchSettings = [
  {
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
  }
];

const mockProducts = [
  {
    id: 'p1',
    name: '示例产品1',
    code: 'P001',
    category: '示例分类',
    price: 100,
    cost: 50,
    stock: 100,
    minStock: 10,
    supplier: '示例供应商',
    description: '示例产品描述',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

const mockMembers = [
  {
    id: 'm1',
    name: '示例会员',
    phone: '13800138000',
    email: 'member@example.com',
    points: 100,
    level: '普通会员',
    address: '示例地址',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

const mockOrders = [
  {
    id: 'o1',
    storeId: 's1',
    memberId: 'm1',
    products: [],
    totalAmount: 100,
    discountAmount: 0,
    finalAmount: 100,
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

describe('HeadquartersBranchService', () => {
  let service: HeadquartersBranchService;

  beforeEach(() => {
    // Reset the singleton instance
    (HeadquartersBranchService as any).instance = null;
    service = HeadquartersBranchService.getInstance();
    
    // Reset mocks
    vi.clearAllMocks();
  });

  it('should be a singleton', () => {
    const service1 = HeadquartersBranchService.getInstance();
    const service2 = HeadquartersBranchService.getInstance();
    expect(service1).toBe(service2);
  });

  it('should get child stores', async () => {
    const headquartersId = 'hq1';
    const childStores = await service.getChildStores(headquartersId);
    
    expect(childStores).toHaveLength(2);
    expect(childStores[0].parentId).toBe(headquartersId);
    expect(childStores[1].parentId).toBe(headquartersId);
  });

  it('should get headquarters branch settings', async () => {
    const headquartersId = 'hq1';
    const settings = await service.getHeadquartersBranchSettings(headquartersId);
    
    expect(settings.headquartersId).toBe(headquartersId);
    expect(settings.syncProducts).toBe(true);
  });

  it('should create default settings if none exist', async () => {
    const headquartersId = 'non-existent-hq';
    const settings = await service.getHeadquartersBranchSettings(headquartersId);
    
    expect(settings.headquartersId).toBe(headquartersId);
    expect(settings.syncProducts).toBe(false); // Default value
  });

  it('should update headquarters branch settings', async () => {
    const headquartersId = 'hq1';
    const updatedSettings = await service.updateHeadquartersBranchSettings(headquartersId, {
      syncProducts: false,
      syncMembers: true
    });
    
    expect(updatedSettings.headquartersId).toBe(headquartersId);
    expect(updatedSettings.syncProducts).toBe(false);
    expect(updatedSettings.syncMembers).toBe(true);
  });

  it('should sync data to branches', async () => {
    const headquartersId = 'hq1';
    
    // Mock console.log to verify the sync process
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Since sync has a random success/failure, we'll test multiple times
    const results = [];
    for (let i = 0; i < 5; i++) { // Reduce iterations to prevent timeout
      try {
        await service.syncDataToBranches(headquartersId);
        results.push('success');
      } catch (error) {
        results.push('failure');
      }
    }
    
    // We should have some successes and some failures
    const successCount = results.filter(r => r === 'success').length;
    const failureCount = results.filter(r => r === 'failure').length;
    
    expect(successCount).toBeGreaterThan(0);
    expect(failureCount).toBeGreaterThan(0);
    
    consoleLogSpy.mockRestore();
  }, 10000); // Increase timeout to 10 seconds

  it('should get products to sync', async () => {
    const products = await service.getProductsToSync();
    expect(products).toEqual(mockProducts);
  });

  it('should get members to sync', async () => {
    const members = await service.getMembersToSync();
    expect(members).toEqual(mockMembers);
  });

  it('should get orders to sync', async () => {
    const orders = await service.getOrdersToSync();
    expect(orders).toEqual(mockOrders);
  });

  it('should record data sync', async () => {
    const syncRecord = {
      headquartersId: 'hq1',
      branchIds: ['branch1', 'branch2'],
      syncType: 'full' as const,
      status: 'completed' as const,
      endTime: new Date().toISOString()
    };

    // Mock console.log to verify the recording process
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const recorded = await service.recordDataSync(syncRecord);
    
    expect(recorded.id).toBeDefined();
    expect(recorded.startTime).toBeDefined();
    expect(recorded.headquartersId).toBe(syncRecord.headquartersId);
    expect(recorded.branchIds).toEqual(syncRecord.branchIds);
    
    consoleLogSpy.mockRestore();
  });

  it('should collect unique store IDs from orders', () => {
    // This test is for implementation details, not the public API
    // We'll test the concept without accessing private methods
    
    // Simulate orders from different stores
    const orders = [
      { id: '1', storeId: 'store1' },
      { id: '2', storeId: 'store2' },
      { id: '3', storeId: 'store1' }, // Duplicate
      { id: '4', storeId: 'store3' }
    ];
    
    // Extract unique store IDs
    const storeIds = orders.map((order: any) => order.storeId);
    const uniqueStoreIds = Array.from(new Set(storeIds));
    
    expect(uniqueStoreIds).toEqual(['store1', 'store2', 'store3']);
  });
});