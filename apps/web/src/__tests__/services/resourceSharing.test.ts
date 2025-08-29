import { describe, it, expect, beforeEach } from 'vitest';
import { ResourceSharingService } from '../../services/resourceSharing';
import { StoreService } from '../../services/store';

describe('ResourceSharingService', () => {
  let resourceSharingService: ResourceSharingService;
  let storeService: StoreService;
  
  beforeEach(() => {
    resourceSharingService = ResourceSharingService.getInstance();
    storeService = StoreService.getInstance();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should get instance', () => {
    expect(resourceSharingService).toBeDefined();
    const anotherInstance = ResourceSharingService.getInstance();
    expect(anotherInstance).toBe(resourceSharingService);
  });

  it('should handle empty resources', async () => {
    // 测试没有共享资源的情况
    const sharedResources = await resourceSharingService.getAllSharedResources();
    expect(sharedResources).toHaveLength(0);
    
    // 测试特定店铺没有共享资源的情况
    const storeResources = await resourceSharingService.getSharedResourcesForStore('store1');
    expect(storeResources).toHaveLength(0);
  });

  it('should handle empty share requests', async () => {
    // 测试没有共享请求的情况
    const shareRequests = await resourceSharingService.getAllShareRequests();
    expect(shareRequests).toHaveLength(0);
    
    // 测试特定店铺没有共享请求的情况
    const storeRequests = await resourceSharingService.getShareRequestsForStore('store1');
    expect(storeRequests).toHaveLength(0);
  });

  it('should create and manage resource sharing', async () => {
    // 创建两个测试店铺
    const store1 = await storeService.createStore({
      name: 'Store 1',
      code: 'S1',
      address: 'Address 1',
      phone: '123456789',
      manager: 'Manager 1',
      isActive: true,
      level: 0
    });

    // 等待一点时间确保第二个店铺有不同ID
    await new Promise(resolve => setTimeout(resolve, 10));

    const store2 = await storeService.createStore({
      name: 'Store 2',
      code: 'S2',
      address: 'Address 2',
      phone: '987654321',
      manager: 'Manager 2',
      isActive: true,
      level: 1,
      parentId: store1.id
    });


    // 确保两个店铺ID不同
    expect(store1.id).not.toBe(store2.id);

    // 测试共享资源
    const sharedResource = await resourceSharingService.shareResource(
      'product1',
      'product',
      store1.id,
      [store2.id]
    );


    expect(sharedResource).toBeDefined();
    expect(sharedResource.id).toBe('product_product1_' + store1.id);
    expect(sharedResource.type).toBe('product');
    expect(sharedResource.sourceStoreId).toBe(store1.id);
    expect(sharedResource.sharedWith).toHaveLength(1);
    expect(sharedResource.sharedWith[0].storeId).toBe(store2.id);

    // 测试获取所有共享资源
    const allSharedResources = await resourceSharingService.getAllSharedResources();
    expect(allSharedResources).toHaveLength(1);

    // 测试获取特定店铺的共享资源
    const store2Resources = await resourceSharingService.getSharedResourcesForStore(store2.id);
    expect(store2Resources).toHaveLength(1);
    expect(store2Resources[0].id).toBe(sharedResource.id);

    // 测试停止资源共享
    await resourceSharingService.stopSharingResource(
      sharedResource.id, // 使用完整资源ID
      store1.id,
      store2.id
    );

    // 验证资源共享已停止
    const updatedStore2Resources = await resourceSharingService.getSharedResourcesForStore(store2.id);
    expect(updatedStore2Resources).toHaveLength(0);
  });

  it('should create and process share requests', async () => {
    // 创建两个测试店铺
    const store1 = await storeService.createStore({
      name: 'Store 1',
      code: 'S1',
      address: 'Address 1',
      phone: '123456789',
      manager: 'Manager 1',
      isActive: true,
      level: 0
    });

    // 等待一点时间确保第二个店铺有不同ID
    await new Promise(resolve => setTimeout(resolve, 10));

    const store2 = await storeService.createStore({
      name: 'Store 2',
      code: 'S2',
      address: 'Address 2',
      phone: '987654321',
      manager: 'Manager 2',
      isActive: true,
      level: 1,
      parentId: store1.id
    });

    // 创建共享请求
    const shareRequest = await resourceSharingService.createShareRequest(
      'product1',
      'product',
      'Test Product',
      store2.id,
      store1.id
    );

    expect(shareRequest).toBeDefined();
    expect(shareRequest.resourceId).toBe('product1');
    expect(shareRequest.resourceType).toBe('product');
    expect(shareRequest.requestingStoreId).toBe(store2.id);
    expect(shareRequest.targetStoreId).toBe(store1.id);
    expect(shareRequest.status).toBe('pending');

    // 测试获取所有共享请求
    const allRequests = await resourceSharingService.getAllShareRequests();
    expect(allRequests).toHaveLength(1);

    // 测试获取特定店铺的共享请求
    const store1Requests = await resourceSharingService.getShareRequestsForStore(store1.id);
    expect(store1Requests).toHaveLength(1);
    expect(store1Requests[0].id).toBe(shareRequest.id);

    // 处理共享请求（批准）
    await resourceSharingService.processShareRequest(shareRequest.id, 'approved');

    // 验证请求状态已更新
    const updatedRequests = await resourceSharingService.getAllShareRequests();
    expect(updatedRequests[0].status).toBe('approved');
  });
});