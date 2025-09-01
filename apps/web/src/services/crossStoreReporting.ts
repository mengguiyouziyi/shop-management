import { StoreService } from './store';
import { StorageService } from './storage';
import type { Order, Product, Member } from '../types';
import { SalesReportData, ProductSalesRanking, InventoryReportData, ReportingService } from './reporting';

export interface CrossStoreSalesReport {
  storeId: string;
  storeName: string;
  salesData: SalesReportData[];
  totalSales: number;
  totalOrders: number;
}

export interface CrossStoreInventoryReport {
  storeId: string;
  storeName: string;
  inventoryData: InventoryReportData[];
  totalProducts: number;
  outOfStockProducts: number;
}

export interface AggregatedSalesReport {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  storeBreakdown: Array<{
    storeId: string;
    storeName: string;
    sales: number;
    orders: number;
    itemsSold: number;
  }>;
}

export class CrossStoreReportingService {
  private static instance: CrossStoreReportingService;
  private storeService: StoreService;
  private storageService: StorageService;
  private reportingService: ReportingService;

  private constructor() {
    this.storeService = StoreService.getInstance();
    this.storageService = StorageService.getInstance();
    this.reportingService = ReportingService.getInstance();
  }

  static getInstance(): CrossStoreReportingService {
    if (!CrossStoreReportingService.instance) {
      CrossStoreReportingService.instance = new CrossStoreReportingService();
    }
    return CrossStoreReportingService.instance;
  }

  // 获取所有店铺的销售数据
  async getAllStoreSalesData(startDate: Date, endDate: Date): Promise<CrossStoreSalesReport[]> {
    const stores = await this.storeService.getAllStores();
    const reports: CrossStoreSalesReport[] = [];

    for (const store of stores) {
      // 获取店铺数据
      const storeData = this.storageService.get<any>(`app_state_${store.id}`);
      if (storeData) {
        const orders: Order[] = storeData.orders || [];
        const salesData = this.reportingService.getSalesReportData(orders, startDate, endDate);
        
        const totalSales = salesData.reduce((sum, day) => sum + day.totalSales, 0);
        const totalOrders = salesData.reduce((sum, day) => sum + day.totalOrders, 0);
        
        reports.push({
          storeId: store.id,
          storeName: store.name,
          salesData,
          totalSales,
          totalOrders
        });
      }
    }

    return reports;
  }

  // 获取所有店铺的库存数据
  async getAllStoreInventoryData(): Promise<CrossStoreInventoryReport[]> {
    const stores = await this.storeService.getAllStores();
    const reports: CrossStoreInventoryReport[] = [];

    for (const store of stores) {
      // 获取店铺数据
      const storeData = this.storageService.get<any>(`app_state_${store.id}`);
      if (storeData) {
        const products: Product[] = storeData.products || [];
        const inventoryData = this.reportingService.getInventoryReportData(products);
        
        const totalProducts = inventoryData.length;
        const outOfStockProducts = inventoryData.filter(item => item.status === 'out').length;
        
        reports.push({
          storeId: store.id,
          storeName: store.name,
          inventoryData,
          totalProducts,
          outOfStockProducts
        });
      }
    }

    return reports;
  }

  // 获取聚合销售报表数据
  async getAggregatedSalesReport(startDate: Date, endDate: Date): Promise<AggregatedSalesReport[]> {
    const storeReports = await this.getAllStoreSalesData(startDate, endDate);
    
    // 汇总所有店铺的数据
    const aggregatedData: Record<string, AggregatedSalesReport> = {};

    // 初始化每个日期的聚合数据
    storeReports.forEach(storeReport => {
      storeReport.salesData.forEach(dailyData => {
        if (!aggregatedData[dailyData.date]) {
          aggregatedData[dailyData.date] = {
            date: dailyData.date,
            totalSales: 0,
            totalOrders: 0,
            totalItemsSold: 0,
            storeBreakdown: []
          };
        }
      });
    });

    // 填充每个店铺的数据
    storeReports.forEach(storeReport => {
      storeReport.salesData.forEach(dailyData => {
        const aggregated = aggregatedData[dailyData.date];
        if (aggregated) {
          aggregated.totalSales += dailyData.totalSales;
          aggregated.totalOrders += dailyData.totalOrders;
          aggregated.totalItemsSold += dailyData.totalItemsSold;
          
          aggregated.storeBreakdown.push({
            storeId: storeReport.storeId,
            storeName: storeReport.storeName,
            sales: dailyData.totalSales,
            orders: dailyData.totalOrders,
            itemsSold: dailyData.totalItemsSold
          });
        }
      });
    });

    return Object.values(aggregatedData).sort((a, b) => a.date.localeCompare(b.date));
  }

  // 获取跨店铺商品销售排行
  async getCrossStoreProductRanking(): Promise<ProductSalesRanking[]> {
    const stores = await this.storeService.getAllStores();
    const allProductSales: Record<string, ProductSalesRanking> = {};

    for (const store of stores) {
      // 获取店铺数据
      const storeData = this.storageService.get<any>(`app_state_${store.id}`);
      if (storeData) {
        const orders: Order[] = storeData.orders || [];
        const products: Product[] = storeData.products || [];
        
        // 获取该店铺的商品销售排行
        const storeRanking = this.reportingService.getProductSalesRanking(orders, products);
        
        // 合并到总排行中
        storeRanking.forEach(item => {
          if (!allProductSales[item.productId]) {
            allProductSales[item.productId] = { ...item };
          } else {
            allProductSales[item.productId].quantitySold += item.quantitySold;
            allProductSales[item.productId].totalRevenue += item.totalRevenue;
          }
        });
      }
    }

    // 转换为数组并排序
    return Object.values(allProductSales)
      .sort((a, b) => b.quantitySold - a.quantitySold);
  }
}