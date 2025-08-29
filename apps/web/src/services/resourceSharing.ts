import { StoreService } from './store';
import { StorageService } from './storage';
import { Product, Member } from '../types';

export interface SharedResource {
  id: string;
  name: string;
  type: 'product' | 'member' | 'supplier';
  sourceStoreId: string;
  sourceStoreName: string;
  sharedWith: Array<{
    storeId: string;
    storeName: string;
    sharedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceShareRequest {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'product' | 'member' | 'supplier';
  requestingStoreId: string;
  requestingStoreName: string;
  targetStoreId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export class ResourceSharingService {
  private static instance: ResourceSharingService;
  private storeService: StoreService;
  private storageService: StorageService;

  private constructor() {
    this.storeService = StoreService.getInstance();
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): ResourceSharingService {
    if (!ResourceSharingService.instance) {
      ResourceSharingService.instance = new ResourceSharingService();
    }
    return ResourceSharingService.instance;
  }

  // 获取所有共享资源
  async getAllSharedResources(): Promise<SharedResource[]> {
    const sharedResources = this.storageService.get<SharedResource[]>('shared_resources');
    return sharedResources || [];
  }

  // 获取特定店铺的共享资源
  async getSharedResourcesForStore(storeId: string): Promise<SharedResource[]> {
    const allSharedResources = await this.getAllSharedResources();
    return allSharedResources.filter(resource => 
      resource.sharedWith.some(shared => shared.storeId === storeId)
    );
  }

  // 共享资源到其他店铺
  async shareResource(
    resourceId: string,
    resourceType: 'product' | 'member' | 'supplier',
    sourceStoreId: string,
    targetStoreIds: string[]
  ): Promise<SharedResource> {
    const allSharedResources = await this.getAllSharedResources();
    const stores = await this.storeService.getAllStores();
    
    // 获取源店铺信息
    const sourceStore = stores.find(store => store.id === sourceStoreId);
    if (!sourceStore) {
      throw new Error('源店铺不存在');
    }

    // 获取目标店铺信息
    const targetStores = stores.filter(store => targetStoreIds.includes(store.id));
    // 注意：这里我们不再检查目标店铺数量是否匹配，因为可能是异步创建的
    
    // 获取资源名称
    let resourceName = '未知资源';
    if (resourceType === 'product') {
      const storeData = this.storageService.get<any>(`app_state_${sourceStoreId}`);
      if (storeData && storeData.products) {
        const product = storeData.products.find((p: Product) => p.id === resourceId);
        if (product) {
          resourceName = product.name;
        }
      }
    }

    // 检查是否已存在该资源的共享记录
    const existingResourceIndex = allSharedResources.findIndex(
      resource => resource.id === `${resourceType}_${resourceId}_${sourceStoreId}`
    );

    const sharedWith = targetStores.map(store => ({
      storeId: store.id,
      storeName: store.name,
      sharedAt: new Date().toISOString()
    }));

    let sharedResource: SharedResource;

    if (existingResourceIndex === -1) {
      // 创建新的共享资源记录
      sharedResource = {
        id: `${resourceType}_${resourceId}_${sourceStoreId}`,
        name: resourceName,
        type: resourceType,
        sourceStoreId,
        sourceStoreName: sourceStore.name,
        sharedWith,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      allSharedResources.push(sharedResource);
    } else {
      // 更新现有的共享资源记录
      const existingResource = allSharedResources[existingResourceIndex];
      
      // 合并新的共享目标
      const updatedSharedWith = [...existingResource.sharedWith];
      sharedWith.forEach(newShare => {
        if (!updatedSharedWith.some(share => share.storeId === newShare.storeId)) {
          updatedSharedWith.push(newShare);
        }
      });
      
      sharedResource = {
        ...existingResource,
        sharedWith: updatedSharedWith,
        updatedAt: new Date().toISOString()
      };
      
      allSharedResources[existingResourceIndex] = sharedResource;
    }

    // 保存更新后的共享资源列表
    this.storageService.set('shared_resources', allSharedResources);
    
    return sharedResource;
  }

  // 停止资源共享
  async stopSharingResource(resourceId: string, sourceStoreId: string, targetStoreId: string): Promise<void> {
    const allSharedResources = await this.getAllSharedResources();
    const resourceIndex = allSharedResources.findIndex(
      resource => resource.id === resourceId && resource.sourceStoreId === sourceStoreId
    );

    if (resourceIndex === -1) {
      throw new Error('共享资源不存在');
    }

    const resource = allSharedResources[resourceIndex];
    const updatedSharedWith = resource.sharedWith.filter(share => share.storeId !== targetStoreId);

    if (updatedSharedWith.length === 0) {
      // 如果没有共享目标，删除整个资源记录
      allSharedResources.splice(resourceIndex, 1);
    } else {
      // 更新共享目标列表
      allSharedResources[resourceIndex] = {
        ...resource,
        sharedWith: updatedSharedWith,
        updatedAt: new Date().toISOString()
      };
    }

    this.storageService.set('shared_resources', allSharedResources);
  }

  // 获取共享请求
  async getAllShareRequests(): Promise<ResourceShareRequest[]> {
    const shareRequests = this.storageService.get<ResourceShareRequest[]>('resource_share_requests');
    return shareRequests || [];
  }

  // 创建共享请求
  async createShareRequest(
    resourceId: string,
    resourceType: 'product' | 'member' | 'supplier',
    resourceName: string,
    requestingStoreId: string,
    targetStoreId: string
  ): Promise<ResourceShareRequest> {
    const shareRequests = await this.getAllShareRequests();
    const stores = await this.storeService.getAllStores();
    
    const requestingStore = stores.find(store => store.id === requestingStoreId);
    const targetStore = stores.find(store => store.id === targetStoreId);
    
    if (!requestingStore || !targetStore) {
      throw new Error('请求店铺或目标店铺不存在');
    }

    const shareRequest: ResourceShareRequest = {
      id: `share_request_${Date.now()}`,
      resourceId,
      resourceName,
      resourceType,
      requestingStoreId,
      requestingStoreName: requestingStore.name,
      targetStoreId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    shareRequests.push(shareRequest);
    this.storageService.set('resource_share_requests', shareRequests);
    
    return shareRequest;
  }

  // 处理共享请求
  async processShareRequest(requestId: string, status: 'approved' | 'rejected'): Promise<void> {
    const shareRequests = await this.getAllShareRequests();
    const requestIndex = shareRequests.findIndex(request => request.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('共享请求不存在');
    }

    shareRequests[requestIndex] = {
      ...shareRequests[requestIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    this.storageService.set('resource_share_requests', shareRequests);

    // 如果请求被批准，实际执行资源共享
    if (status === 'approved') {
      const request = shareRequests[requestIndex];
      await this.shareResource(
        request.resourceId,
        request.resourceType,
        request.targetStoreId, // 资源来自目标店铺
        [request.requestingStoreId] // 分享给请求店铺
      );
    }
  }

  // 获取特定店铺的共享请求
  async getShareRequestsForStore(storeId: string): Promise<ResourceShareRequest[]> {
    const allRequests = await this.getAllShareRequests();
    return allRequests.filter(
      request => request.targetStoreId === storeId || request.requestingStoreId === storeId
    );
  }
}