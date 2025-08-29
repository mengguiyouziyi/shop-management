import { Store, StoreSettings } from '../types/store';
import { StorageService } from './storage';

export class StoreService {
  private static instance: StoreService;
  private storageService: StorageService;
  private currentStoreKey = 'current_store';

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  // 获取所有店铺
  async getAllStores(): Promise<Store[]> {
    const stores = this.storageService.get<Store[]>('stores');
    return stores || [];
  }

  // 获取当前店铺
  getCurrentStore(): Store | null {
    return this.storageService.get<Store>(this.currentStoreKey);
  }

  // 设置当前店铺
  setCurrentStore(store: Store): void {
    this.storageService.set(this.currentStoreKey, store);
  }

  // 创建新店铺
  async createStore(storeData: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>): Promise<Store> {
    const stores = await this.getAllStores();
    const newStore: Store = {
      ...storeData,
      id: `store_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    stores.push(newStore);
    this.storageService.set('stores', stores);
    
    // 如果这是第一个店铺，设置为当前店铺
    if (stores.length === 1) {
      this.setCurrentStore(newStore);
    }
    
    return newStore;
  }

  // 更新店铺信息
  async updateStore(storeId: string, updates: Partial<Store>): Promise<void> {
    const stores = await this.getAllStores();
    const index = stores.findIndex(store => store.id === storeId);
    
    if (index === -1) {
      throw new Error('店铺不存在');
    }
    
    stores[index] = {
      ...stores[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.storageService.set('stores', stores);
    
    // 如果更新的是当前店铺，也需要更新当前店铺信息
    const currentStore = this.getCurrentStore();
    if (currentStore && currentStore.id === storeId) {
      this.setCurrentStore(stores[index]);
    }
  }

  // 删除店铺
  async deleteStore(storeId: string): Promise<void> {
    const stores = await this.getAllStores();
    const filteredStores = stores.filter(store => store.id !== storeId);
    this.storageService.set('stores', filteredStores);
    
    // 如果删除的是当前店铺，清除当前店铺设置
    const currentStore = this.getCurrentStore();
    if (currentStore && currentStore.id === storeId) {
      this.storageService.remove(this.currentStoreKey);
    }
  }

  // 获取店铺设置
  async getStoreSettings(storeId: string): Promise<StoreSettings | null> {
    const settings = this.storageService.get<Record<string, StoreSettings>>('store_settings');
    return settings ? settings[storeId] || null : null;
  }

  // 更新店铺设置
  async updateStoreSettings(storeId: string, settings: Partial<StoreSettings>): Promise<StoreSettings> {
    let allSettings = this.storageService.get<Record<string, StoreSettings>>('store_settings') || {};
    
    const existingSettings = allSettings[storeId] || {
      id: `settings_${storeId}`,
      storeId,
      currency: 'CNY',
      taxRate: 0,
      timezone: 'Asia/Shanghai',
      receiptTemplate: '',
      printerSettings: {}
    };
    
    const updatedSettings: StoreSettings = {
      ...existingSettings,
      ...settings,
      id: existingSettings.id,
      storeId
    };
    
    allSettings = {
      ...allSettings,
      [storeId]: updatedSettings
    };
    
    this.storageService.set('store_settings', allSettings);
    return updatedSettings;
  }
}
