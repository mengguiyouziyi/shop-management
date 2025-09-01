// 模拟数据
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

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  level: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  storeId: string;
  memberId: string;
  products: any[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface DataSyncRecord {
  id: string;
  headquartersId: string;
  branchIds: string[];
  syncType: 'full' | 'incremental';
  status: 'pending' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  details?: string;
}

export class HeadquartersBranchService {
  private static instance: HeadquartersBranchService;

  private constructor() {}

  public static getInstance(): HeadquartersBranchService {
    if (!HeadquartersBranchService.instance) {
      HeadquartersBranchService.instance = new HeadquartersBranchService();
    }
    return HeadquartersBranchService.instance;
  }

  /**
   * 获取总部下的所有分店
   */
  async getChildStores(headquartersId: string): Promise<any[]> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const childStores = mockStores.filter(store => store.parentId === headquartersId);
        resolve(childStores);
      }, 100);
    });
  }

  /**
   * 获取总部-分店设置
   */
  async getHeadquartersBranchSettings(headquartersId: string): Promise<HeadquartersBranchSettings> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const settings = mockHeadquartersBranchSettings.find(setting => setting.headquartersId === headquartersId);
        if (settings) {
          resolve(settings);
        } else {
          // 如果没有设置，返回默认设置
          resolve({
            id: `settings_${Date.now()}`,
            headquartersId,
            syncProducts: false,
            syncMembers: false,
            syncSuppliers: false,
            syncPricing: false,
            syncInventory: false,
            allowCrossStoreOrders: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }, 100);
    });
  }

  /**
   * 更新总部-分店设置
   */
  async updateHeadquartersBranchSettings(
    headquartersId: string,
    settings: Partial<HeadquartersBranchSettings>
  ): Promise<HeadquartersBranchSettings> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingSettingsIndex = mockHeadquartersBranchSettings.findIndex(
          s => s.headquartersId === headquartersId
        );

        const updatedSettings: HeadquartersBranchSettings = {
          id: existingSettingsIndex !== -1 
            ? mockHeadquartersBranchSettings[existingSettingsIndex].id 
            : `settings_${Date.now()}`,
          headquartersId,
          syncProducts: settings.syncProducts ?? false,
          syncMembers: settings.syncMembers ?? false,
          syncSuppliers: settings.syncSuppliers ?? false,
          syncPricing: settings.syncPricing ?? false,
          syncInventory: settings.syncInventory ?? false,
          allowCrossStoreOrders: settings.allowCrossStoreOrders ?? false,
          createdAt: existingSettingsIndex !== -1 
            ? mockHeadquartersBranchSettings[existingSettingsIndex].createdAt 
            : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (existingSettingsIndex !== -1) {
          mockHeadquartersBranchSettings[existingSettingsIndex] = updatedSettings;
        } else {
          mockHeadquartersBranchSettings.push(updatedSettings);
        }

        resolve(updatedSettings);
      }, 100);
    });
  }

  /**
   * 同步数据到分店
   */
  async syncDataToBranches(headquartersId: string): Promise<void> {
    // 模拟API调用
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟50%的成功率
        if (Math.random() > 0.5) {
          console.log(`Data synced successfully from headquarters ${headquartersId} to all branches`);
          resolve();
        } else {
          console.error(`Failed to sync data from headquarters ${headquartersId} to branches`);
          reject(new Error('数据同步失败'));
        }
      }, 500);
    });
  }

  /**
   * 获取需要同步的产品数据
   */
  async getProductsToSync(): Promise<Product[]> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 100);
    });
  }

  /**
   * 获取需要同步的会员数据
   */
  async getMembersToSync(): Promise<Member[]> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMembers);
      }, 100);
    });
  }

  /**
   * 获取需要同步的订单数据
   */
  async getOrdersToSync(): Promise<Order[]> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockOrders);
      }, 100);
    });
  }

  /**
   * 记录数据同步历史
   */
  async recordDataSync(syncRecord: Omit<DataSyncRecord, 'id' | 'startTime'>): Promise<DataSyncRecord> {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord: DataSyncRecord = {
          ...syncRecord,
          id: `sync_${Date.now()}`,
          startTime: new Date().toISOString()
        };
        console.log('Data sync recorded:', newRecord);
        resolve(newRecord);
      }, 100);
    });
  }
}