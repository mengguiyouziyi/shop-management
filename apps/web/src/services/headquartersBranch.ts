import { StoreService } from './store';
import { StorageService } from './storage';
import { Store, StorePermission } from '../types/store';
import { Product, Member, Supplier, Order } from '../types';

export interface HeadquartersBranchSettings {
  id: string;
  headquartersId: string;
  syncProducts: boolean;
  syncMembers: boolean;
  syncSuppliers: boolean;
  syncPricing: boolean;
  syncInventory: boolean;
  allowCrossStoreOrders: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CrossStoreOrder {
  id: string;
  sourceStoreId: string;
  targetStoreId: string;
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export class HeadquartersBranchService {
  private static instance: HeadquartersBranchService;
  private storeService: StoreService;
  private storageService: StorageService;

  private constructor() {
    this.storeService = StoreService.getInstance();
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): HeadquartersBranchService {
    if (!HeadquartersBranchService.instance) {
      HeadquartersBranchService.instance = new HeadquartersBranchService();
    }
    return HeadquartersBranchService.instance;
  }

  // 获取总部-分店设置
  async getHeadquartersBranchSettings(headquartersId: string): Promise<HeadquartersBranchSettings | null> {
    const settings = this.storageService.get<Record<string, HeadquartersBranchSettings>>('headquarters_branch_settings');
    return settings ? settings[headquartersId] || null : null;
  }

  // 更新总部-分店设置
  async updateHeadquartersBranchSettings(
    headquartersId: string, 
    updates: Partial<HeadquartersBranchSettings>
  ): Promise<HeadquartersBranchSettings> {
    let allSettings = this.storageService.get<Record<string, HeadquartersBranchSettings>>('headquarters_branch_settings') || {};
    
    const existingSettings = allSettings[headquartersId] || {
      id: `hb_settings_${headquartersId}`,
      headquartersId,
      syncProducts: true,
      syncMembers: false,
      syncSuppliers: false,
      syncPricing: true,
      syncInventory: false,
      allowCrossStoreOrders: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedSettings: HeadquartersBranchSettings = {
      ...existingSettings,
      ...updates,
      id: existingSettings.id,
      headquartersId,
      updatedAt: new Date().toISOString()
    };
    
    allSettings = {
      ...allSettings,
      [headquartersId]: updatedSettings
    };
    
    this.storageService.set('headquarters_branch_settings', allSettings);
    return updatedSettings;
  }

  // 获取子店铺
  async getChildStores(headquartersId: string): Promise<Store[]> {
    const allStores = await this.storeService.getAllStores();
    return allStores.filter(store => store.parentId === headquartersId);
  }

  // 获取总部及其所有子店铺
  async getHeadquartersAndBranches(headquartersId: string): Promise<Store[]> {
    const headquarters = await this.storeService.getAllStores();
    const result: Store[] = [];
    
    const headStore = headquarters.find(store => store.id === headquartersId);
    if (headStore) {
      result.push(headStore);
      
      // 递归获取所有子店铺
      const getChildStoresRecursive = (parentId: string) => {
        const children = headquarters.filter(store => store.parentId === parentId);
        children.forEach(child => {
          result.push(child);
          getChildStoresRecursive(child.id);
        });
      };
      
      getChildStoresRecursive(headquartersId);
    }
    
    return result;
  }

  // 同步产品数据到分店
  async syncProductsToBranches(headquartersId: string): Promise<void> {
    const settings = await this.getHeadquartersBranchSettings(headquartersId);
    if (!settings || !settings.syncProducts) {
      return;
    }

    // 获取总部数据
    const headquartersData = this.storageService.get<any>(`app_state_${headquartersId}`);
    if (!headquartersData || !headquartersData.products) {
      return;
    }

    const products: Product[] = headquartersData.products;
    const branches = await this.getChildStores(headquartersId);
    
    // 同步到所有分店
    for (const branch of branches) {
      const branchData = this.storageService.get<any>(`app_state_${branch.id}`) || {};
      branchData.products = products.map(product => ({
        ...product,
        id: product.id, // 保持产品ID一致
        createdAt: product.createdAt,
        updatedAt: new Date().toISOString()
      }));
      
      this.storageService.set(`app_state_${branch.id}`, branchData);
    }
  }

  // 同步会员数据到分店
  async syncMembersToBranches(headquartersId: string): Promise<void> {
    const settings = await this.getHeadquartersBranchSettings(headquartersId);
    if (!settings || !settings.syncMembers) {
      return;
    }

    // 获取总部数据
    const headquartersData = this.storageService.get<any>(`app_state_${headquartersId}`);
    if (!headquartersData || !headquartersData.members) {
      return;
    }

    const members: Member[] = headquartersData.members;
    const branches = await this.getChildStores(headquartersId);
    
    // 同步到所有分店
    for (const branch of branches) {
      const branchData = this.storageService.get<any>(`app_state_${branch.id}`) || {};
      branchData.members = members.map(member => ({
        ...member,
        id: member.id, // 保持会员ID一致
        createdAt: member.createdAt,
        updatedAt: new Date().toISOString()
      }));
      
      this.storageService.set(`app_state_${branch.id}`, branchData);
    }
  }

  // 同步供应商数据到分店
  async syncSuppliersToBranches(headquartersId: string): Promise<void> {
    const settings = await this.getHeadquartersBranchSettings(headquartersId);
    if (!settings || !settings.syncSuppliers) {
      return;
    }

    // 获取总部数据
    const headquartersData = this.storageService.get<any>(`app_state_${headquartersId}`);
    if (!headquartersData || !headquartersData.suppliers) {
      return;
    }

    const suppliers: Supplier[] = headquartersData.suppliers;
    const branches = await this.getChildStores(headquartersId);
    
    // 同步到所有分店
    for (const branch of branches) {
      const branchData = this.storageService.get<any>(`app_state_${branch.id}`) || {};
      branchData.suppliers = suppliers.map(supplier => ({
        ...supplier,
        id: supplier.id, // 保持供应商ID一致
        createdAt: supplier.createdAt,
        updatedAt: new Date().toISOString()
      }));
      
      this.storageService.set(`app_state_${branch.id}`, branchData);
    }
  }

  // 创建跨店铺订单
  async createCrossStoreOrder(
    sourceStoreId: string,
    targetStoreId: string,
    orderId: string
  ): Promise<CrossStoreOrder> {
    const settings = await this.getHeadquartersBranchSettings(sourceStoreId);
    if (!settings || !settings.allowCrossStoreOrders) {
      throw new Error('跨店铺订单功能未启用');
    }

    const crossStoreOrders = this.storageService.get<CrossStoreOrder[]>('cross_store_orders') || [];
    
    const crossStoreOrder: CrossStoreOrder = {
      id: `cso_${Date.now()}`,
      sourceStoreId,
      targetStoreId,
      orderId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    crossStoreOrders.push(crossStoreOrder);
    this.storageService.set('cross_store_orders', crossStoreOrders);
    
    return crossStoreOrder;
  }

  // 更新跨店铺订单状态
  async updateCrossStoreOrderStatus(
    crossStoreOrderId: string,
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
  ): Promise<void> {
    const crossStoreOrders = this.storageService.get<CrossStoreOrder[]>('cross_store_orders') || [];
    const index = crossStoreOrders.findIndex(order => order.id === crossStoreOrderId);
    
    if (index === -1) {
      throw new Error('跨店铺订单不存在');
    }
    
    crossStoreOrders[index] = {
      ...crossStoreOrders[index],
      status,
      updatedAt: new Date().toISOString()
    };
    
    this.storageService.set('cross_store_orders', crossStoreOrders);
  }

  // 获取店铺间的跨店铺订单
  async getCrossStoreOrders(storeId: string): Promise<CrossStoreOrder[]> {
    const crossStoreOrders = this.storageService.get<CrossStoreOrder[]>('cross_store_orders') || [];
    return crossStoreOrders.filter(
      order => order.sourceStoreId === storeId || order.targetStoreId === storeId
    );
  }
}