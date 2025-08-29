import { describe, it, expect, beforeEach } from 'vitest';
import { CrossStoreReportingService } from '../../services/crossStoreReporting';
import { StoreService } from '../../services/store';
import { StorageService } from '../../services/storage';

describe('CrossStoreReportingService', () => {
  let crossStoreReportingService: CrossStoreReportingService;
  let storeService: StoreService;
  let storageService: StorageService;
  
  beforeEach(() => {
    crossStoreReportingService = CrossStoreReportingService.getInstance();
    storeService = StoreService.getInstance();
    storageService = StorageService.getInstance();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should get instance', () => {
    expect(crossStoreReportingService).toBeDefined();
    const anotherInstance = CrossStoreReportingService.getInstance();
    expect(anotherInstance).toBe(crossStoreReportingService);
  });

  it('should handle empty stores', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    
    // 测试没有店铺时的销售数据
    const salesData = await crossStoreReportingService.getAllStoreSalesData(startDate, endDate);
    expect(salesData).toHaveLength(0);
    
    // 测试没有店铺时的库存数据
    const inventoryData = await crossStoreReportingService.getAllStoreInventoryData();
    expect(inventoryData).toHaveLength(0);
    
    // 测试没有店铺时的聚合销售数据
    const aggregatedData = await crossStoreReportingService.getAggregatedSalesReport(startDate, endDate);
    expect(aggregatedData).toHaveLength(0);
    
    // 测试没有店铺时的商品排行
    const productRanking = await crossStoreReportingService.getCrossStoreProductRanking();
    expect(productRanking).toHaveLength(0);
  });

  it('should handle stores with no data', async () => {
    // 创建一个空店铺
    const store = await storeService.createStore({
      name: 'Test Store',
      code: 'TS001',
      address: 'Test Address',
      phone: '123456789',
      manager: 'Test Manager',
      isActive: true,
      level: 0
    });
    
    // 确保存储中没有数据
    storageService.set(`app_state_${store.id}`, {});
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    
    // 测试空数据店铺的销售数据
    const salesData = await crossStoreReportingService.getAllStoreSalesData(startDate, endDate);
    expect(salesData).toHaveLength(1);
    expect(salesData[0].salesData).toHaveLength(0);
    expect(salesData[0].totalSales).toBe(0);
    expect(salesData[0].totalOrders).toBe(0);
    
    // 测试空数据店铺的库存数据
    const inventoryData = await crossStoreReportingService.getAllStoreInventoryData();
    expect(inventoryData).toHaveLength(1);
    expect(inventoryData[0].inventoryData).toHaveLength(0);
    expect(inventoryData[0].totalProducts).toBe(0);
    expect(inventoryData[0].outOfStockProducts).toBe(0);
  });
});