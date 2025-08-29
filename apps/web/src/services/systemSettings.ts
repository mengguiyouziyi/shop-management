import { StorageService } from './storage';

export interface SystemSettings {
  id: string;
  // 公司信息
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  
  // 货币设置
  currency: string;
  currencySymbol: string;
  
  // 打印设置
  printReceipt: boolean;
  printInvoice: boolean;
  
  // 税收设置
  taxEnabled: boolean;
  taxRate: number;
  
  // 库存设置
  lowStockThreshold: number;
  enableStockTracking: boolean;
  
  // 会员设置
  enableLoyaltyProgram: boolean;
  pointsPerCurrency: number;
  currencyPerPoint: number;
  
  // 多店铺设置
  enableMultiStore: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export class SystemSettingsService {
  private static instance: SystemSettingsService;
  private storageService: StorageService;
  private readonly SETTINGS_KEY = 'system_settings';

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  public static getInstance(): SystemSettingsService {
    if (!SystemSettingsService.instance) {
      SystemSettingsService.instance = new SystemSettingsService();
    }
    return SystemSettingsService.instance;
  }

  // 获取系统设置
  async getSystemSettings(): Promise<SystemSettings | null> {
    try {
      const settings = this.storageService.get<SystemSettings>(this.SETTINGS_KEY);
      return settings;
    } catch (error) {
      console.error('获取系统设置失败:', error);
      return null;
    }
  }

  // 更新系统设置
  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const existingSettings = await this.getSystemSettings();
      const now = new Date().toISOString();
      
      const newSettings: SystemSettings = {
        id: existingSettings?.id || `settings_${Date.now()}`,
        companyName: settings.companyName || existingSettings?.companyName || '',
        companyAddress: settings.companyAddress || existingSettings?.companyAddress || '',
        companyPhone: settings.companyPhone || existingSettings?.companyPhone || '',
        companyEmail: settings.companyEmail || existingSettings?.companyEmail || '',
        currency: settings.currency || existingSettings?.currency || 'CNY',
        currencySymbol: settings.currencySymbol || existingSettings?.currencySymbol || '¥',
        printReceipt: settings.printReceipt !== undefined ? settings.printReceipt : (existingSettings?.printReceipt ?? true),
        printInvoice: settings.printInvoice !== undefined ? settings.printInvoice : (existingSettings?.printInvoice ?? false),
        taxEnabled: settings.taxEnabled !== undefined ? settings.taxEnabled : (existingSettings?.taxEnabled ?? false),
        taxRate: settings.taxRate !== undefined ? settings.taxRate : (existingSettings?.taxRate ?? 0),
        lowStockThreshold: settings.lowStockThreshold !== undefined ? settings.lowStockThreshold : (existingSettings?.lowStockThreshold ?? 10),
        enableStockTracking: settings.enableStockTracking !== undefined ? settings.enableStockTracking : (existingSettings?.enableStockTracking ?? true),
        enableLoyaltyProgram: settings.enableLoyaltyProgram !== undefined ? settings.enableLoyaltyProgram : (existingSettings?.enableLoyaltyProgram ?? true),
        pointsPerCurrency: settings.pointsPerCurrency !== undefined ? settings.pointsPerCurrency : (existingSettings?.pointsPerCurrency ?? 1),
        currencyPerPoint: settings.currencyPerPoint !== undefined ? settings.currencyPerPoint : (existingSettings?.currencyPerPoint ?? 1),
        enableMultiStore: settings.enableMultiStore !== undefined ? settings.enableMultiStore : (existingSettings?.enableMultiStore ?? false),
        createdAt: existingSettings?.createdAt || now,
        updatedAt: now
      };
      
      this.storageService.set(this.SETTINGS_KEY, newSettings);
      return newSettings;
    } catch (error) {
      console.error('更新系统设置失败:', error);
      throw new Error('更新系统设置失败');
    }
  }

  // 获取默认设置
  getDefaultSettings(): SystemSettings {
    const now = new Date().toISOString();
    return {
      id: `settings_${Date.now()}`,
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
      currency: 'CNY',
      currencySymbol: '¥',
      printReceipt: true,
      printInvoice: false,
      taxEnabled: false,
      taxRate: 0,
      lowStockThreshold: 10,
      enableStockTracking: true,
      enableLoyaltyProgram: true,
      pointsPerCurrency: 1,
      currencyPerPoint: 1,
      enableMultiStore: false,
      createdAt: now,
      updatedAt: now
    };
  }
}