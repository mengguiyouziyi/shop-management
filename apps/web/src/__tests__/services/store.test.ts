import { describe, it, expect, beforeEach } from 'vitest';
import { StoreService } from '../../services/store';
import { Store } from '../../types/store';

describe('StoreService', () => {
  let storeService: StoreService;
  
  beforeEach(() => {
    storeService = StoreService.getInstance();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should create store', async () => {
    const storeData = {
      name: 'Test Store',
      code: 'TS001',
      address: 'Test Address',
      phone: '123456789',
      manager: 'Test Manager',
      isActive: true,
      level: 0
    };

    const store = await storeService.createStore(storeData);
    
    expect(store).toBeDefined();
    expect(store.id).toBeDefined();
    expect(store.name).toBe(storeData.name);
    expect(store.code).toBe(storeData.code);
    expect(store.level).toBe(0); //总部层级为0
  });

  it('should get all stores', async () => {
    const storeData = {
      name: 'Test Store',
      code: 'TS001',
      address: 'Test Address',
      phone: '123456789',
      manager: 'Test Manager',
      isActive: true,
      level: 0
    };

    await storeService.createStore(storeData);
    const stores = await storeService.getAllStores();
    
    expect(stores).toHaveLength(1);
    expect(stores[0].name).toBe(storeData.name);
  });

  it('should manage store permissions', async () => {
    // 创建测试店铺
    const storeData = {
      name: 'Test Store',
      code: 'TS001',
      address: 'Test Address',
      phone: '123456789',
      manager: 'Test Manager',
      isActive: true,
      level: 0
    };

    const store = await storeService.createStore(storeData);
    
    // 设置店铺权限
    const permissions = ['read_products', 'write_products'];
    const storePermission = await storeService.setStorePermission(
      store.id, 
      'user123', 
      'manager', 
      permissions
    );
    
    expect(storePermission).toBeDefined();
    expect(storePermission.storeId).toBe(store.id);
    expect(storePermission.userId).toBe('user123');
    expect(storePermission.role).toBe('manager');
    expect(storePermission.permissions).toEqual(permissions);
    
    // 获取用户权限
    const userPermissions = await storeService.getUserPermissions('user123');
    expect(userPermissions).toHaveLength(1);
    expect(userPermissions[0].storeId).toBe(store.id);
    
    // 获取店铺权限
    const storePermissions = await storeService.getStorePermissions(store.id);
    expect(storePermissions).toHaveLength(1);
    expect(storePermissions[0].userId).toBe('user123');
  });

  it('should handle store hierarchy', async () => {
    // 创建总部
    const headquartersData = {
      name: '总部',
      code: 'HQ',
      address: '总部地址',
      phone: '123456789',
      manager: '总部经理',
      isActive: true,
      level: 0
    };

    const headquarters = await storeService.createStore(headquartersData);
    console.log('Headquarters created:', headquarters);
    
    // 创建分店
    const branchData = {
      name: '分店1',
      code: 'B1',
      address: '分店地址',
      phone: '987654321',
      manager: '分店经理',
      isActive: true,
      parentId: headquarters.id,
      level: 1
    };

    const branch = await storeService.createStore(branchData);
    console.log('Branch created:', branch);
    
    // 验证店铺层级
    expect(headquarters.level).toBe(0);
    expect(branch.level).toBe(1);
    expect(branch.parentId).toBe(headquarters.id);
    
    // 获取子店铺
    const childStores = await storeService.getChildStores(headquarters.id);
    console.log('Child stores:', childStores);
    expect(childStores).toHaveLength(1);
    expect(childStores[0].id).toBe(branch.id);
    
    // 获取店铺层级路径 (包括分店本身)
    const hierarchy = await storeService.getStoreHierarchy(branch.id);
    expect(hierarchy).toHaveLength(2);
    expect(hierarchy[0].id).toBe(headquarters.id);
    expect(hierarchy[1].id).toBe(branch.id);
  });
});