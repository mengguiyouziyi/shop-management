import { describe, it, expect, beforeEach } from 'vitest';
import { SystemSettingsService } from '../../services/systemSettings';

describe('SystemSettingsService', () => {
  let systemSettingsService: SystemSettingsService;
  
  beforeEach(() => {
    systemSettingsService = SystemSettingsService.getInstance();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should get instance', () => {
    expect(systemSettingsService).toBeDefined();
    const anotherInstance = SystemSettingsService.getInstance();
    expect(anotherInstance).toBe(systemSettingsService);
  });

  it('should handle empty system settings', async () => {
    const settings = await systemSettingsService.getSystemSettings();
    expect(settings).toBeNull();
  });

  it('should create and update system settings', async () => {
    // 创建设置
    const newSettings = await systemSettingsService.updateSystemSettings({
      companyName: 'Test Company',
      companyAddress: 'Test Address',
      companyPhone: '123456789',
      companyEmail: 'test@example.com',
      currency: 'USD',
      currencySymbol: '$',
      taxEnabled: true,
      taxRate: 10
    });
    
    expect(newSettings).toBeDefined();
    expect(newSettings.companyName).toBe('Test Company');
    expect(newSettings.currency).toBe('USD');
    expect(newSettings.taxEnabled).toBe(true);
    expect(newSettings.taxRate).toBe(10);
    
    // 获取设置
    const retrievedSettings = await systemSettingsService.getSystemSettings();
    expect(retrievedSettings).toEqual(newSettings);
    
    // 更新设置
    const updatedSettings = await systemSettingsService.updateSystemSettings({
      companyName: 'Updated Company',
      taxRate: 15
    });
    
    expect(updatedSettings.companyName).toBe('Updated Company');
    expect(updatedSettings.taxRate).toBe(15);
    expect(updatedSettings.currency).toBe('USD'); // 保持原有值
  });

  it('should return default settings structure', () => {
    const defaultSettings = systemSettingsService.getDefaultSettings();
    expect(defaultSettings).toBeDefined();
    expect(defaultSettings.currency).toBe('CNY');
    expect(defaultSettings.currencySymbol).toBe('¥');
    expect(defaultSettings.printReceipt).toBe(true);
  });
});