import { describe, it, expect, beforeEach } from 'vitest';
import { HeadquartersBranchService } from '../../services/headquartersBranch';
import { StoreService } from '../../services/store';
import { StorageService } from '../../services/storage';

describe('HeadquartersBranchService', () => {
  let headquartersBranchService: HeadquartersBranchService;
  let storeService: StoreService;
  let storageService: StorageService;
  
  beforeEach(() => {
    headquartersBranchService = HeadquartersBranchService.getInstance();
    storeService = StoreService.getInstance();
    storageService = StorageService.getInstance();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should get instance', () => {
    expect(headquartersBranchService).toBeDefined();
    const anotherInstance = HeadquartersBranchService.getInstance();
    expect(anotherInstance).toBe(headquartersBranchService);
  });

  it('should handle empty headquarters branch settings', async () => {
    const settings = await headquartersBranchService.getHeadquartersBranchSettings('hq1');
    expect(settings).toBeNull();
  });

  it('should create and update headquarters branch settings', async () => {
    const headquartersId = 'hq1';
    
    // 创建设置
    const settings = await headquartersBranchService.updateHeadquartersBranchSettings(
      headquartersId,
      {
        syncProducts: true,
        syncMembers: true,
        syncSuppliers: false
      }
    );
    
    expect(settings).toBeDefined();
    expect(settings.headquartersId).toBe(headquartersId);
    expect(settings.syncProducts).toBe(true);
    expect(settings.syncMembers).toBe(true);
    expect(settings.syncSuppliers).toBe(false);
    
    // 获取设置
    const retrievedSettings = await headquartersBranchService.getHeadquartersBranchSettings(headquartersId);
    expect(retrievedSettings).toEqual(settings);
    
    // 更新设置
    const updatedSettings = await headquartersBranchService.updateHeadquartersBranchSettings(
      headquartersId,
      {
        syncSuppliers: true,
        allowCrossStoreOrders: true
      }
    );
    
    expect(updatedSettings.syncSuppliers).toBe(true);
    expect(updatedSettings.allowCrossStoreOrders).toBe(true);
  });

  it('should manage headquarters and branches', async () => {
    // 创建总部
    const headquarters = await storeService.createStore({
      name: '总部',
      code: 'HQ',
      address: '总部地址',
      phone: '123456789',
      manager: '总部经理',
      isActive: true,
      level: 0
    });
    
    // 等待一段时间确保时间戳不同
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // 创建分店1
    const branch1 = await storeService.createStore({
      name: '分店1',
      code: 'B1',
      address: '分店1地址',
      phone: '111111111',
      manager: '分店1经理',
      isActive: true,
      level: 1,
      parentId: headquarters.id
    });
    
    // 等待一段时间确保时间戳不同
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // 创建分店2
    const branch2 = await storeService.createStore({
      name: '分店2',
      code: 'B2',
      address: '分店2地址',
      phone: '222222222',
      manager: '分店2经理',
      isActive: true,
      level: 1,
      parentId: headquarters.id
    });
    
    // 等待一段时间确保时间戳不同
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // 创建其他店铺（不属于总部）
    const otherStore = await storeService.createStore({
      name: '其他店铺',
      code: 'OS1',
      address: '其他店铺地址',
      phone: '333333333',
      manager: '其他店铺经理',
      isActive: true,
      level: 0
    });
    
    // 等待一段时间确保时间戳不同
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // 创建子分店
    const subBranch = await storeService.createStore({
      name: '子分店',
      code: 'SB1',
      address: '子分店地址',
      phone: '444444444',
      manager: '子分店经理',
      isActive: true,
      level: 2,
      parentId: branch1.id
    });
    
    // 确保所有店铺ID都不同
    const storeIds = [headquarters.id, branch1.id, branch2.id, otherStore.id, subBranch.id];
    const uniqueStoreIds = [...new Set(storeIds)];
    expect(storeIds).toHaveLength(uniqueStoreIds.length);
    
    // 获取子店铺（只获取直属分店）
    const childStores = await headquartersBranchService.getChildStores(headquarters.id);
    expect(childStores).toHaveLength(2);
    expect(childStores.map(store => store.id)).toContain(branch1.id);
    expect(childStores.map(store => store.id)).toContain(branch2.id);
    expect(childStores.map(store => store.id)).not.toContain(subBranch.id);
    expect(childStores.map(store => store.id)).not.toContain(otherStore.id);
    
    // 获取总部及其所有子店铺
    const allStores = await headquartersBranchService.getHeadquartersAndBranches(headquarters.id);
    expect(allStores).toHaveLength(4); // 总部 + 2个分店 + 1个子分店
    expect(allStores.map(store => store.id)).toContain(headquarters.id);
    expect(allStores.map(store => store.id)).toContain(branch1.id);
    expect(allStores.map(store => store.id)).toContain(branch2.id);
    expect(allStores.map(store => store.id)).toContain(subBranch.id);
    expect(allStores.map(store => store.id)).not.toContain(otherStore.id);
  });

  it('should manage cross store orders', async () => {
    const sourceStoreId = 'store1';
    const targetStoreId = 'store2';
    const orderId = 'order123';
    
    // 启用跨店铺订单功能
    await headquartersBranchService.updateHeadquartersBranchSettings(
      sourceStoreId,
      {
        allowCrossStoreOrders: true
      }
    );
    
    // 创建跨店铺订单
    const crossStoreOrder = await headquartersBranchService.createCrossStoreOrder(
      sourceStoreId,
      targetStoreId,
      orderId
    );
    
    expect(crossStoreOrder).toBeDefined();
    expect(crossStoreOrder.sourceStoreId).toBe(sourceStoreId);
    expect(crossStoreOrder.targetStoreId).toBe(targetStoreId);
    expect(crossStoreOrder.orderId).toBe(orderId);
    expect(crossStoreOrder.status).toBe('pending');
    
    // 获取店铺的跨店铺订单
    const sourceOrders = await headquartersBranchService.getCrossStoreOrders(sourceStoreId);
    expect(sourceOrders).toHaveLength(1);
    expect(sourceOrders[0].id).toBe(crossStoreOrder.id);
    
    const targetOrders = await headquartersBranchService.getCrossStoreOrders(targetStoreId);
    expect(targetOrders).toHaveLength(1);
    expect(targetOrders[0].id).toBe(crossStoreOrder.id);
    
    // 更新跨店铺订单状态
    await headquartersBranchService.updateCrossStoreOrderStatus(
      crossStoreOrder.id,
      'processing'
    );
    
    const updatedOrders = await headquartersBranchService.getCrossStoreOrders(sourceStoreId);
    expect(updatedOrders[0].status).toBe('processing');
  });

  it('should handle cross store orders with disabled feature', async () => {
    const sourceStoreId = 'store1';
    const targetStoreId = 'store2';
    const orderId = 'order123';
    
    // 确保跨店铺订单功能未启用
    await headquartersBranchService.updateHeadquartersBranchSettings(
      sourceStoreId,
      {
        allowCrossStoreOrders: false
      }
    );
    
    // 尝试创建跨店铺订单应该失败
    await expect(
      headquartersBranchService.createCrossStoreOrder(sourceStoreId, targetStoreId, orderId)
    ).rejects.toThrow('跨店铺订单功能未启用');
  });
});